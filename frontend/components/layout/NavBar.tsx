"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearUserId } from "@/lib/api";

export default function NavBar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        clearUserId();
        router.push("/login");
    };

    const navItems = [
        { href: "/chat", label: "DASHBOARD" },
        { href: "/transactions", label: "TRANSACTIONS" },
        { href: "/networth", label: "NET WORTH" },
        { href: "/cards", label: "CARDS" },
        { href: "/profile", label: "PROFILE" },
    ];

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(11, 14, 20, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: 'var(--space-sm) var(--space-unit)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <Link href="/chat" style={{ textDecoration: 'none' }}>
                    <h1 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        letterSpacing: 'var(--letter-spacing-wide)',
                        textTransform: 'uppercase',
                        color: 'var(--accent-coral)',
                        margin: 0,
                        position: 'relative',
                        paddingBottom: '4px'
                    }}>
                        FINANCEHUB
                    </h1>
                </Link>

                <nav style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--accent-aqua)' : 'var(--text-body)',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    opacity: isActive ? 1 : 0.7,
                                    borderBottom: isActive ? '2px solid var(--accent-aqua)' : '2px solid transparent',
                                    paddingBottom: '4px',
                                    transition: 'all 0.2s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: 'var(--letter-spacing)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.opacity = '0.7';
                                }}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                    
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '2px',
                            color: 'var(--text-body)',
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--letter-spacing)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 600
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-coral)';
                            e.currentTarget.style.color = 'var(--accent-coral)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            e.currentTarget.style.color = 'var(--text-body)';
                        }}
                    >
                        LOGOUT
                    </button>
                </nav>
            </div>
        </header>
    );
}
