import { NextResponse } from "next/server";

const AI_API_URL = "https://saige-unemotive-su.ngrok-free.dev/api/chat";

export async function POST(request: Request) {
    try {
        const { message, session_id, user_id } = await request.json();

        if (!user_id) {
            return NextResponse.json({
                success: false,
                error: "User ID is required"
            }, { status: 400 });
        }

        // Call the external AI API
        const response = await fetch(AI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({
                message,
                session_id: session_id || undefined,
                agent_id: "personal_advisor",
                user_id
            })
        });

        if (!response.ok) {
            throw new Error(`AI API returned status ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            content: data.response || "No response from AI",
            session_id: data.session_id,
            agent_id: data.agent_id,
            user_id: data.user_id
        });

    } catch (error) {
        console.error("Error calling AI API:", error);
        return NextResponse.json({
            success: false,
            content: "Sorry, I encountered an error processing your message. Please try again.",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
