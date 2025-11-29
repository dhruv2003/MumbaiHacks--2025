"use client";

import { useState } from "react";

interface ArtifactViewProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    type: "code" | "text";
    language?: string;
}

export function ArtifactView({ isOpen, onClose, title, content, type }: ArtifactViewProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ width: '100%', height: '100%', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-subtle)' }}>
            {/* Header - fixed */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-sm) var(--space-md)',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.01)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6, border: '1px solid var(--border-subtle)', padding: '2px 6px' }}>
                        {type}
                    </span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{title}</h3>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: copied ? 'var(--accent-aqua)' : 'var(--text-body)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            opacity: copied ? 1 : 0.6
                        }}
                    >
                        {copied ? "COPIED" : "COPY"}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-coral)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase'
                        }}
                    >
                        CLOSE
                    </button>
                </div>
            </div>

            {/* Content - scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)' }}>
                {type === "code" ? (
                    <pre style={{
                        background: 'rgba(255, 255, 255, 0.01)',
                        padding: 'var(--space-md)',
                        border: '1px solid var(--border-subtle)',
                        overflowX: 'auto',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        fontFamily: 'monospace',
                        margin: 0,
                        color: 'var(--text-body)'
                    }}>
                        <code>{content}</code>
                    </pre>
                ) : (
                    <div style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        color: 'var(--text-body)',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {content}
                    </div>
                )}
            </div>
        </div>
    );
}
