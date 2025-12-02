from langchain.tools import tool
import asyncio
from datetime import datetime

try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False


def run_async(func, *args, **kwargs):
    """Safe async runner for LangChain tools."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return asyncio.ensure_future(func(*args, **kwargs))
        return loop.run_until_complete(func(*args, **kwargs))
    except RuntimeError:
        return asyncio.run(func(*args, **kwargs))


@tool
def find_flight_deals(origin: str, destination: str, date: str) -> str:
    """
    Finds real flight prices (no mock). If scraping fails, clearly notifies user.
    """
    try:
        return run_async(_find_flight_deals_async, origin, destination, date)
    except Exception as e:
        return f"Error running tool: {str(e)}"


async def _find_flight_deals_async(origin: str, destination: str, date: str) -> str:
    if not PLAYWRIGHT_AVAILABLE:
        return "Playwright is not installed. Cannot fetch real-time prices."

    # Airport code mapping
    city_codes = {
        "mumbai": "BOM", "delhi": "DEL", "bangalore": "BLR",
        "bengaluru": "BLR", "chennai": "MAA", "kolkata": "CCU", "hyderabad": "HYD"
    }

    origin_code = city_codes.get(origin.lower(), origin.upper())
    dest_code = city_codes.get(destination.lower(), destination.upper())

    # Validate date
    try:
        dt = datetime.strptime(date, "%Y-%m-%d")
        goibibo_date = dt.strftime("%Y%m%d")
    except:
        return "Invalid date format. Use YYYY-MM-DD."

    results = []
    scraping_errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-http2",
                "--no-sandbox",
            ]
        )

        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/120.0.0.0 Safari/537.36",
            ignore_https_errors=True
        )

        # ---------------------------------------------------------
        # GOIBIBO SCRAPING
        # ---------------------------------------------------------
        try:
            page = await context.new_page()
            url = f"https://www.goibibo.com/flights/air-{origin_code}-{dest_code}-{goibibo_date}--1-0-0-E-D/"
            await page.goto(url, timeout=15000)
            await page.wait_for_load_state("networkidle", timeout=10000)

            # Attempt extraction (Goibibo heavily blocks bots)
            price_element = await page.query_selector("span.fareText")  # Selector may vary
            airline_element = await page.query_selector(".airlineName")

            if price_element and airline_element:
                price = await price_element.inner_text()
                airline = await airline_element.inner_text()

                results.append({
                    "source": "Goibibo",
                    "airline": airline.strip(),
                    "price": price.replace("₹", "").strip(),
                    "url": url
                })
            else:
                scraping_errors.append("Goibibo: Selectors not found / content blocked.")

        except Exception as e:
            scraping_errors.append(f"Goibibo error: {str(e)}")

        # ---------------------------------------------------------
        # MAKEMYTRIP SCRAPING
        # ---------------------------------------------------------
        try:
            page = await context.new_page()
            url = "https://www.makemytrip.com/flights/"
            await page.goto(url, timeout=15000)
            await page.wait_for_timeout(4000)

            # MMT blocks automation very aggressively.
            price_el = await page.query_selector("div.fliList-body-section li span")  
            airline_el = await page.query_selector("span.airways-name")

            if price_el and airline_el:
                price = await price_el.inner_text()
                airline = await airline_el.inner_text()

                results.append({
                    "source": "MakeMyTrip",
                    "airline": airline.strip(),
                    "price": price.replace("₹", "").strip(),
                    "url": url
                })
            else:
                scraping_errors.append("MakeMyTrip: Selectors not found / content blocked.")

        except Exception as e:
            scraping_errors.append(f"MMT error: {str(e)}")

        await browser.close()

    # ---------------------------------------------------------
    # FINAL RESPONSE
    # ---------------------------------------------------------
    response = f"✈️ **Real-Time Flight Price Lookup**\n"
    response += f"Route: **{origin.title()} → {destination.title()}**\n"
    response += f"Date: **{date}**\n\n"

    if results:
        response += "### ✅ Real Prices Found:\n"
        for r in results:
            response += f"- **{r['source']}** – {r['airline']} – ₹{r['price']}\n"
        return response

    # No data — return detailed failure report
    response += "### ❌ Could not retrieve real-time prices.\n"
    response += "Travel websites likely blocked automation.\n\n"
    response += "### Debug Details:\n"
    for err in scraping_errors:
        response += f"- {err}\n"

    response += "\nNo mock data returned."

    return response
