"use client";

import { useState, useEffect } from "react";
import { ChatInterface, Message } from "@/components/chat/ChatInterface";
import { ArtifactView } from "@/components/chat/ArtifactView";
import { PaymentModal } from "@/components/payment/PaymentModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNetWorth, getTransactions, formatCurrency, formatDate, clearUserId } from "@/lib/api";

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "Hello! I'm ready to help you optimize your finances.\n\nTry asking:\n• \"How is my budget looking?\"\n• \"Analyze my portfolio\"\n• \"Show recent transactions\"" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isArtifactOpen, setIsArtifactOpen] = useState(false);
    const [artifactContent, setArtifactContent] = useState("");
    const [artifactTitle, setArtifactTitle] = useState("");
    const [artifactType, setArtifactType] = useState<"code" | "text">("code");
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const [netWorth, setNetWorth] = useState<any>(null);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    const handleLogout = () => {
        clearUserId();
        router.push("/login");
    };

    useEffect(() => {
        loadFinancialData();
    }, []);

    const loadFinancialData = async () => {
        try {
            const [netWorthResult, txnResult] = await Promise.all([
                getNetWorth(),
                getTransactions({ from: '2025-05-01', to: '2025-11-30', limit: 5 })
            ]);

            if (netWorthResult.success && netWorthResult.data) {
                setNetWorth(netWorthResult.data);
            }

            if (txnResult.success && txnResult.data) {
                setRecentTransactions(txnResult.data.transactions || []);
            }
        } catch (error) {
            console.error('Error loading financial data:', error);
        }
    };

    const handleSendMessage = async (content: string) => {
        const newMessage: Message = { id: Date.now().toString(), role: "user", content };
        setMessages((prev) => [...prev, newMessage]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content || data.message || "I'm processing your request...",
                hasArtifact: !!data.artifact,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (data.artifact) {
                setArtifactTitle(data.artifact.title);
                setArtifactContent(data.artifact.content);
                setArtifactType(data.artifact.type);
                setIsArtifactOpen(true);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, I encountered an error processing your message.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPortfolio = netWorth?.breakdown?.netAssets || 0;
    const monthlySpending = 0; // Calculate from transactions

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="dashboard-grid">
                {/* LEFT PANEL: Analytics & Insights */}
                <aside className="left-panel panel">
                    <div className="panel-header">
                        <div className="logo">
                            <h1>FINANCEHUB</h1>
                        </div>
                    </div>

                    <div className="scrollable-content">
                        {/* Key Metrics */}
                        <div className="stats-container">
                            <div className="stat-card">
                                <div className="stat-content">
                                    <div className="stat-label">Total Portfolio</div>
                                    <div className="stat-value">{formatCurrency(totalPortfolio)}</div>
                                    <div className="stat-change positive">+12.5%</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-content">
                                    <div className="stat-label">Monthly Spending</div>
                                    <div className="stat-value">{formatCurrency(monthlySpending)}</div>
                                    <div className="stat-change">Budget: ₹90,000</div>
                                </div>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="insights-section">
                            <h3>AI Insights</h3>
                            <div className="insights-grid">
                                <div className="insight-card">
                                    <div className="insight-header">
                                        <strong>Portfolio Balance</strong>
                                    </div>
                                    <p>Your investments are well diversified across multiple asset classes.</p>
                                </div>
                                <div className="insight-card">
                                    <div className="insight-header">
                                        <strong>Spending Alert</strong>
                                    </div>
                                    <p>Dining expenses are trending high this week.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CENTER PANEL: Chat Interface */}
                <main className="center-panel panel">
                    <div className="chat-container">
                        <div className="chat-header">
                            <div className="chat-title">
                                <h3>AI Financial Advisor</h3>
                                <p className="chat-subtitle">Your personal wealth manager</p>
                            </div>
                        </div>

                        <div className="chat-messages-wrapper">
                            <ChatInterface
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                isLoading={isLoading}
                                onViewArtifact={() => setIsArtifactOpen(true)}
                            />
                        </div>
                    </div>
                </main>

                {/* RIGHT PANEL: Goals & Activity */}
                <aside className="right-panel panel">
                    <div className="panel-header">
                        <h3>Overview</h3>
                    </div>

                    <div className="scrollable-content">
                        {/* Goals */}
                        <div className="section-block">
                            <h3>Active Goals</h3>
                            <div className="goals-grid">
                                <div className="goal-card">
                                    <h4>Emergency Fund</h4>
                                    <div className="goal-progress">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '60%' }}></div>
                                        </div>
                                        <div className="progress-info">
                                            <span>₹3.6L / ₹6L</span>
                                            <span>60%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="goal-card">
                                    <h4>Home Down Payment</h4>
                                    <div className="goal-progress">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '20%' }}></div>
                                        </div>
                                        <div className="progress-info">
                                            <span>₹5L / ₹25L</span>
                                            <span>20%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="section-block">
                            <h3>Recent Activity</h3>
                            <div className="table-container compact-table">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Merchant</th>
                                            <th style={{ textAlign: 'right' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.length > 0 ? (
                                            recentTransactions.map((txn, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <div style={{ fontWeight: 600 }}>{txn.category}</div>
                                                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{formatDate(txn.date)}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }} className={txn.type === 'CREDIT' ? 'positive' : 'negative'}>
                                                        {txn.type === 'CREDIT' ? '+' : ''}{formatCurrency(txn.amount)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="loading">Loading...</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
        </div>
    );
}
