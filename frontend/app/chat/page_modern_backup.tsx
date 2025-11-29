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

    // Financial data
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
                headers: {
                    'Content-Type': 'application/json',
                },
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
                content: "Sorry, I encountered an error processing your message. The chat endpoint is being configured.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const totalAssets = netWorth?.breakdown?.assets?.total || 0;
    const totalLiabilities = netWorth?.breakdown?.liabilities?.total || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="grid grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_360px] h-screen overflow-hidden">
                
                {/* LEFT SIDEBAR - Navigation */}
                <div className="border-r border-slate-800/50 bg-slate-950/50 backdrop-blur-xl flex flex-col p-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold shadow-lg">
                                FH
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 blur-md opacity-50"></div>
                        </div>
                        <span className="text-xl font-bold text-white">FinanceHub</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 flex-1">
                        <NavLink href="/chat" icon={<MessageSquare className="w-5 h-5" />} active>
                            Dashboard
                        </NavLink>
                        <NavLink href="/transactions" icon={<BarChart3 className="w-5 h-5" />}>
                            Transactions
                        </NavLink>
                        <NavLink href="/networth" icon={<TrendingUp className="w-5 h-5" />}>
                            Net Worth
                        </NavLink>
                        <NavLink href="/cards" icon={<CreditCard className="w-5 h-5" />}>
                            Cards
                        </NavLink>
                        <NavLink href="/profile" icon={<User className="w-5 h-5" />}>
                            Profile
                        </NavLink>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </nav>

                    {/* Quick Stats */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                        <div className="text-xs text-slate-400 mb-2">Net Worth</div>
                        <div className="text-2xl font-bold text-white">
                            {netWorth ? formatCurrency(netWorth.breakdown?.netAssets || 0) : 'Loading...'}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">+12.5% this month</span>
                        </div>
                    </div>
                </div>

                {/* CENTER - Chat Interface */}
                <div className="flex flex-col bg-slate-950/30">
                    {/* Header */}
                    <div className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl px-8 py-5">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            AI Financial Assistant
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Ask me anything about your finances</p>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-hidden">
                        <ChatInterface
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            onViewArtifact={() => setIsArtifactOpen(true)}
                        />
                    </div>
                </div>

                {/* RIGHT SIDEBAR - Insights */}
                <div className="hidden lg:flex flex-col border-l border-slate-800/50 bg-slate-950/50 backdrop-blur-xl p-6 overflow-y-auto">
                    {isArtifactOpen ? (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Artifact</h3>
                                <button 
                                    onClick={() => setIsArtifactOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors text-sm"
                                >
                                    Close
                                </button>
                            </div>
                            <ArtifactView
                                isOpen={isArtifactOpen}
                                onClose={() => setIsArtifactOpen(false)}
                                title={artifactTitle}
                                content={artifactContent}
                                type={artifactType}
                            />
                        </div>
                    ) : (
                        <>
                            {/* Financial Overview */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                                    Financial Overview
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-400">Total Assets</span>
                                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            {formatCurrency(totalAssets)}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-400">Total Liabilities</span>
                                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            {formatCurrency(totalLiabilities)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {recentTransactions.slice(0, 5).map((txn, i) => (
                                        <div 
                                            key={i} 
                                            className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <span className="text-sm font-medium text-white truncate">{txn.category}</span>
                                                <span className={`text-sm font-semibold ${
                                                    txn.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500">{formatDate(txn.date)}</div>
                                        </div>
                                    ))}
                                    
                                    {recentTransactions.length === 0 && (
                                        <div className="text-center text-slate-500 text-sm py-8">
                                            No recent transactions
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Suggestions */}
                            <div className="mt-auto">
                                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleSendMessage("Analyze my spending patterns")}
                                        className="w-full p-3 text-left text-sm rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-all duration-200"
                                    >
                                        📊 Analyze Spending
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage("Show my top expenses")}
                                        className="w-full p-3 text-left text-sm rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-all duration-200"
                                    >
                                        💰 Top Expenses
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage("Create a budget plan")}
                                        className="w-full p-3 text-left text-sm rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-all duration-200"
                                    >
                                        📈 Budget Plan
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
        </div>
    );
}

function NavLink({ href, icon, children, active = false }: { href: string; icon: React.ReactNode; children: React.ReactNode; active?: boolean }) {
    return (
        <Link 
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                active 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
        >
            {icon}
            <span>{children}</span>
        </Link>
    );
}
