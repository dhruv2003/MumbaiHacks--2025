"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChartRenderer } from "./ChartRenderer";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    hasArtifact?: boolean;
    chartData?: any;
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    isLoading: boolean;
    onViewArtifact: () => void;
}

export function ChatInterface({ messages, onSendMessage, isLoading, onViewArtifact }: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Parse JSON chart data from message content
    const parseChartData = (content: string) => {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                const parsed = JSON.parse(jsonMatch[1]);
                console.log('Parsed chart data:', parsed);
                if (parsed.type === "chart") {
                    return {
                        chartData: parsed,
                        textContent: content.replace(/```json[\s\S]*?```/g, '').trim()
                    };
                }
            } catch (e) {
                console.error('Failed to parse chart JSON:', e);
                console.error('JSON content:', jsonMatch[1]);
            }
        }
        return { chartData: null, textContent: content };
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Messages area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <AnimatePresence initial={false}>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "85%",
                                    borderLeft: `2px solid ${message.role === "user" ? 'var(--accent-coral)' : 'var(--accent-aqua)'}`,
                                    paddingLeft: 'var(--space-sm)',
                                    background: 'rgba(255, 255, 255, 0.02)'
                                }}
                            >
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: message.role === "user" ? 'var(--accent-coral)' : 'var(--accent-aqua)',
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontWeight: 600
                                }}>
                                    {message.role === "user" ? "YOU" : "SYSTEM"}
                                </div>
                                {(() => {
                                    const { chartData, textContent } = parseChartData(message.content);
                                    return (
                                        <>
                                            <div style={{
                                                fontSize: '1.05rem',
                                                color: 'var(--text-body)',
                                                lineHeight: 1.6,
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {textContent}
                                            </div>
                                            {chartData && <ChartRenderer chartData={chartData} />}
                                        </>
                                    );
                                })()}
                                {message.hasArtifact && (
                                    <button
                                        onClick={onViewArtifact}
                                        style={{
                                            marginTop: '8px',
                                            background: 'transparent',
                                            border: '1px solid var(--accent-aqua)',
                                            color: 'var(--accent-aqua)',
                                            padding: '6px 14px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        VIEW ARTIFACT
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                alignSelf: "flex-start",
                                borderLeft: '2px solid var(--accent-aqua)',
                                paddingLeft: 'var(--space-sm)'
                            }}
                        >
                            <div style={{
                                fontSize: '0.85rem',
                                color: 'var(--accent-aqua)',
                                marginBottom: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: 600
                            }}>
                                SYSTEM
                            </div>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
                                <span style={{
                                    width: '4px',
                                    height: '4px',
                                    background: 'var(--accent-aqua)',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'typingDot 1s infinite'
                                }} />
                                <span style={{
                                    width: '4px',
                                    height: '4px',
                                    background: 'var(--accent-aqua)',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'typingDot 1s infinite 0.2s'
                                }} />
                                <span style={{
                                    width: '4px',
                                    height: '4px',
                                    background: 'var(--accent-aqua)',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'typingDot 1s infinite 0.4s'
                                }} />
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input area */}
            <div style={{
                padding: 'var(--space-md)',
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(11, 14, 20, 0.8)',
                backdropFilter: 'blur(10px)'
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="ENTER COMMAND..."
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--border-subtle)',
                                padding: '14px 0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-primary)',
                                fontSize: '1.1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-aqua)'}
                            onBlur={(e) => e.target.style.borderBottomColor = 'var(--border-subtle)'}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--accent-aqua)',
                            color: 'var(--accent-aqua)',
                            padding: '10px 20px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                            opacity: (!input.trim() || isLoading) ? 0.5 : 1,
                            textTransform: 'uppercase',
                            height: '46px'
                        }}
                    >
                        SEND
                    </button>
                </form>
            </div>
        </div>
    );
}
