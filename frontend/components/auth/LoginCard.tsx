"use client";

import { useState } from "react";
import { login, setAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

export function LoginCard() {
    const router = useRouter();
    const [aaHandle, setAaHandle] = useState(process.env.NEXT_PUBLIC_DEFAULT_AA_HANDLE || "");
    const [pin, setPin] = useState(process.env.NEXT_PUBLIC_DEFAULT_PIN || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login(aaHandle, pin);

        if (result.success && result.data) {
            setAuthToken(result.data.token);
            router.push("/chat");
        } else {
            setError(result.error || "Login failed. Please check your credentials.");
        }

        setLoading(false);
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '480px',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: 'var(--space-lg)',
            background: 'transparent',
            animation: 'fadeIn 0.6s ease'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--letter-spacing-wide)',
                    marginBottom: 'var(--space-sm)'
                }}>
                    FINANCEHUB
                </h1>
                <div style={{
                    width: '60px',
                    height: '2px',
                    background: 'linear-gradient(90deg, var(--accent-coral) 0%, var(--accent-aqua) 100%)',
                    margin: '0 auto var(--space-md)'
                }} />
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-body)',
                    opacity: 0.7
                }}>
                    Sign in to access your financial dashboard
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing-wide)',
                        color: 'var(--text-body)',
                        opacity: 0.6,
                        marginBottom: '8px',
                        fontWeight: 600
                    }}>
                        AA HANDLE
                    </label>
                    <input
                        type="text"
                        placeholder="9876543210@anumati"
                        value={aaHandle}
                        onChange={(e) => setAaHandle(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--border-subtle)',
                            color: 'var(--text-body)',
                            padding: '8px 0',
                            fontSize: '0.95rem',
                            fontFamily: 'var(--font-primary)',
                            letterSpacing: '0.02em'
                        }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing-wide)',
                        color: 'var(--text-body)',
                        opacity: 0.6,
                        marginBottom: '8px',
                        fontWeight: 600
                    }}>
                        PIN
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--border-subtle)',
                            color: 'var(--text-body)',
                            padding: '8px 0',
                            fontSize: '0.95rem',
                            fontFamily: 'var(--font-primary)',
                            letterSpacing: '0.02em'
                        }}
                    />
                </div>

                {error && (
                    <div style={{
                        padding: 'var(--space-sm)',
                        borderLeft: '2px solid var(--accent-coral)',
                        paddingLeft: 'var(--space-md)',
                        fontSize: '0.85rem',
                        color: 'var(--accent-coral)'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: loading ? 'transparent' : 'var(--accent-coral)',
                        border: '1px solid var(--accent-coral)',
                        borderRadius: '2px',
                        padding: '12px 24px',
                        color: loading ? 'var(--accent-coral)' : 'var(--bg-primary)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing)',
                        fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: 'var(--font-primary)',
                        width: '100%',
                        marginTop: 'var(--space-sm)'
                    }}
                >
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>

                <p style={{
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    color: 'var(--text-body)',
                    opacity: 0.6,
                    marginTop: 'var(--space-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--letter-spacing)'
                }}>
                    Demo credentials are pre-filled
                </p>
            </form>
        </div>
    );
}
