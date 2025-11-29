"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('user_id');
      setIsLoggedIn(!!userId);
    }
  }, []);
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Minimalist Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--space-md) var(--space-unit)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: 'var(--letter-spacing-wide)',
            textTransform: 'uppercase',
            color: 'var(--accent-coral)',
            position: 'relative',
            paddingBottom: '4px'
          }}>
            FINANCEHUB
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--accent-coral) 0%, var(--accent-aqua) 100%)'
            }}></div>
          </div>

          <nav style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <a href="#features" style={{
              textDecoration: 'none',
              color: 'var(--text-body)',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)',
              opacity: 0.7,
              transition: 'opacity 0.2s ease'
            }}>
              FEATURES
            </a>
            <a href="#benefits" style={{
              textDecoration: 'none',
              color: 'var(--text-body)',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)',
              opacity: 0.7,
              transition: 'opacity 0.2s ease'
            }}>
              BENEFITS
            </a>
          </nav>

          {isLoggedIn ? (
            <Link href="/chat" style={{
              textDecoration: 'none',
              background: 'transparent',
              border: '1px solid var(--accent-aqua)',
              borderRadius: '2px',
              padding: '10px 28px',
              color: 'var(--accent-aqua)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)',
              fontWeight: 700,
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}>
              DASHBOARD
            </Link>
          ) : (
            <Link href="/login" style={{
              textDecoration: 'none',
              background: 'transparent',
              border: '1px solid var(--accent-coral)',
              borderRadius: '2px',
              padding: '10px 28px',
              color: 'var(--accent-coral)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)',
              fontWeight: 700,
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}>
              LOGIN
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '80px',
        padding: 'var(--space-lg) var(--space-unit)'
      }}>
        <div style={{
          maxWidth: '960px',
          textAlign: 'center'
        }}>
          {/* Main Headline */}
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
            marginBottom: 'var(--space-unit)',
            lineHeight: 1.2
          }}>
            MASTER YOUR
            <br />
            <span style={{ color: 'var(--accent-coral)' }}>FINANCIAL LIFE</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-body)',
            opacity: 0.8,
            maxWidth: '600px',
            margin: '0 auto var(--space-lg)',
            lineHeight: 1.7
          }}>
            Aggregate all your accounts, track your net worth, and get AI-powered insights in one minimal dashboard.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-md)',
            justifyContent: 'center',
            marginBottom: 'var(--space-lg)'
          }}>
            <Link href={isLoggedIn ? "/chat" : "/login"} style={{
              textDecoration: 'none',
              background: 'transparent',
              border: '1px solid var(--accent-coral)',
              borderRadius: '2px',
              padding: '18px 36px',
              color: 'var(--accent-coral)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)',
              fontWeight: 700,
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}>
              {isLoggedIn ? "GO TO DASHBOARD" : "GET STARTED"}
            </Link>
            <a href="#features" style={{
              textDecoration: 'none',
              background: 'transparent',
              border: '1px solid var(--accent-aqua)',
              borderRadius: '2px',
              padding: '18px 36px',
              color: 'var(--accent-aqua)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)',
              fontWeight: 700,
              transition: 'all 0.3s ease',
              display: 'inline-block',
              cursor: 'pointer'
            }}>
              LEARN MORE
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-lg)',
            maxWidth: '600px',
            margin: 'var(--space-lg) auto 0',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--accent-aqua)',
                marginBottom: '8px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                10K+
              </div>
              <div style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing-wide)',
                color: 'var(--text-body)',
                opacity: 0.6
              }}>
                USERS
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--accent-aqua)',
                marginBottom: '8px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₹500CR+
              </div>
              <div style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing-wide)',
                color: 'var(--text-body)',
                opacity: 0.6
              }}>
                TRACKED
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--accent-aqua)',
                marginBottom: '8px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                99.9%
              </div>
              <div style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing-wide)',
                color: 'var(--text-body)',
                opacity: 0.6
              }}>
                UPTIME
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" style={{
        padding: 'var(--space-lg) var(--space-unit)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            WHY FINANCEHUB
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)'
          }}>
            <div style={{
              borderLeft: '1px solid var(--accent-coral)',
              paddingLeft: 'var(--space-md)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-sm)'
              }}>
                ACCOUNT AGGREGATION
              </h3>
              <p style={{
                color: 'var(--text-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                opacity: 0.8
              }}>
                Connect all your bank accounts, credit cards, and investments in one secure place.
              </p>
            </div>

            <div style={{
              borderLeft: '1px solid var(--accent-aqua)',
              paddingLeft: 'var(--space-md)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-sm)'
              }}>
                SMART ANALYTICS
              </h3>
              <p style={{
                color: 'var(--text-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                opacity: 0.8
              }}>
                Get AI-powered insights on spending patterns and investment opportunities.
              </p>
            </div>

            <div style={{
              borderLeft: '1px solid var(--accent-coral)',
              paddingLeft: 'var(--space-md)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-sm)'
              }}>
                BANK-GRADE SECURITY
              </h3>
              <p style={{
                color: 'var(--text-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                opacity: 0.8
              }}>
                Your data is encrypted and secure. We use the latest technology to protect your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'var(--space-lg) var(--space-unit)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-body)',
            opacity: 0.6
          }}>
            © 2024 FINANCEHUB. ALL RIGHTS RESERVED.
          </div>
          <div style={{
            display: 'flex',
            gap: 'var(--space-md)',
            fontSize: '0.75rem'
          }}>
            <a href="#" style={{
              textDecoration: 'none',
              color: 'var(--text-body)',
              opacity: 0.6,
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)'
            }}>
              PRIVACY
            </a>
            <a href="#" style={{
              textDecoration: 'none',
              color: 'var(--text-body)',
              opacity: 0.6,
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)'
            }}>
              TERMS
            </a>
            <a href="#" style={{
              textDecoration: 'none',
              color: 'var(--text-body)',
              opacity: 0.6,
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing)'
            }}>
              CONTACT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
