"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingBag,
    Utensils,
    Plane,
    Home,
    MoreHorizontal
} from "lucide-react";
import {
    getProfile,
    getNetWorth,
    getInvestments,
    getLiabilities,
    getAccounts,
    getTransactions,
    formatCurrency,
    formatDate
} from "@/lib/api";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("cards");
    const [loading, setLoading] = useState(true);

    // State for API data
    const [profile, setProfile] = useState<any>(null);
    const [netWorthData, setNetWorthData] = useState<any>(null);
    const [investments, setInvestments] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        try {
            const [profileResult, netWorthResult, investmentsResult, accountsResult, transactionsResult] = await Promise.all([
                getProfile(),
                getNetWorth(),
                getInvestments(),
                getAccounts(),
                getTransactions({ from: '2025-05-01', to: '2025-11-30', limit: 10 })
            ]);

            if (profileResult.success && profileResult.data) {
                setProfile(profileResult.data);
            }

            if (netWorthResult.success && netWorthResult.data) {
                setNetWorthData(netWorthResult.data);
            }

            if (investmentsResult.success && investmentsResult.data) {
                setInvestments(investmentsResult.data.investments || []);
            }

            if (accountsResult.success && accountsResult.data) {
                setAccounts(accountsResult.data.accounts || []);
            }

            if (transactionsResult.success && transactionsResult.data) {
                setTransactions(transactionsResult.data.transactions || []);
                // Process category breakdown
                if (transactionsResult.data.categoryBreakdown) {
                    const breakdown = Object.entries(transactionsResult.data.categoryBreakdown).map(([category, amount]) => ({
                        category,
                        amount: amount as number
                    }));
                    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
                    const breakdownWithPercentage = breakdown.map(item => ({
                        ...item,
                        percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
                        color: getCategoryColor(item.category)
                    }));
                    setCategoryBreakdown(breakdownWithPercentage);
                }
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Food': 'var(--accent-coral)',
            'Food & Dining': 'var(--accent-coral)',
            'Shopping': 'var(--accent-aqua)',
            'Travel': '#F5F5F5',
            'Transport': '#F5F5F5',
            'Entertainment': '#FFD700',
            'Bills': '#C0C0C0',
            'Utilities': '#C0C0C0'
        };
        return colors[category] || '#888888';
    };

    const totalNetworth = netWorthData?.breakdown?.netAssets || 0;
    const totalInvestments = netWorthData?.breakdown?.assets?.investments || 0;
    const totalCardBalance = netWorthData?.breakdown?.liabilities?.creditCards || 0;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 'var(--space-lg)' }}>
            <NavBar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-lg) var(--space-md)' }}>

                {/* Networth Overview - Giant Numbers */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-lg)',
                    marginBottom: 'var(--space-xl)',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-body)',
                            opacity: 0.6,
                            marginBottom: 'var(--space-sm)',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            textTransform: 'uppercase',
                            fontWeight: 700
                        }}>
                            TOTAL NET WORTH
                        </div>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            color: 'var(--accent-aqua)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {loading ? 'LOADING...' : formatCurrency(totalNetworth)}
                        </div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-body)',
                            opacity: 0.6,
                            marginBottom: 'var(--space-sm)',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            textTransform: 'uppercase',
                            fontWeight: 700
                        }}>
                            TOTAL INVESTMENTS
                        </div>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            color: 'var(--accent-coral)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {loading ? 'LOADING...' : formatCurrency(totalInvestments)}
                        </div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-body)',
                            opacity: 0.6,
                            marginBottom: 'var(--space-sm)',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            textTransform: 'uppercase',
                            fontWeight: 700
                        }}>
                            ACCOUNTS
                        </div>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {loading ? '...' : accounts.length}
                        </div>
                        <div style={{
                            fontSize: '0.7rem',
                            opacity: 0.6,
                            marginTop: 'var(--space-sm)',
                            letterSpacing: 'var(--letter-spacing)',
                            textTransform: 'uppercase'
                        }}>
                            LINKED ACCOUNTS
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-md)' }}>
                        {['cards', 'investments', 'transactions', 'analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--accent-aqua)' : '2px solid transparent',
                                    color: activeTab === tab ? 'var(--accent-aqua)' : 'var(--text-body)',
                                    padding: 'var(--space-sm) var(--space-md)',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    opacity: activeTab === tab ? 1 : 0.6
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Cards Tab */}
                    {activeTab === 'cards' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING ACCOUNTS...</div>
                            ) : accounts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>NO ACCOUNTS FOUND</div>
                            ) : (
                                accounts.map((account, idx) => (
                                    <div key={account.id || idx} style={{
                                        padding: 'var(--space-md)',
                                        border: '1px solid var(--border-subtle)',
                                        background: 'rgba(255, 255, 255, 0.01)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 'var(--space-lg)', textTransform: 'uppercase' }}>{account.accountType}</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 'var(--space-lg)', fontFamily: 'monospace' }}>
                                            {account.maskedAccNumber}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <div>
                                                <div style={{ opacity: 0.5, fontSize: '0.6rem' }}>BANK</div>
                                                <div style={{ textTransform: 'uppercase' }}>{account.fipName}</div>
                                            </div>
                                            <div>
                                                <div style={{ opacity: 0.5, fontSize: '0.6rem' }}>STATUS</div>
                                                <div>{account.status}</div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)', textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>BALANCE</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{formatCurrency(account.currentBalance)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Investments Tab */}
                    {activeTab === 'investments' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING INVESTMENTS...</div>
                            ) : investments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>NO INVESTMENTS FOUND</div>
                            ) : (
                                investments.map((investment, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--space-sm) var(--space-md)',
                                        borderLeft: `2px solid ${investment.returns >= 0 ? 'var(--accent-aqua)' : 'var(--accent-coral)'}`,
                                        background: 'rgba(255, 255, 255, 0.01)'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{investment.schemeName}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>{investment.type}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                color: investment.returns >= 0 ? 'var(--accent-aqua)' : 'var(--accent-coral)'
                                            }}>
                                                {investment.returns > 0 ? "+" : ""}{investment.returnsPercentage?.toFixed(2) || 0}%
                                            </div>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                                                {formatCurrency(investment.currentValue || 0)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING TRANSACTIONS...</div>
                            ) : transactions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>NO TRANSACTIONS FOUND</div>
                            ) : (
                                transactions.map((transaction) => (
                                    <div key={transaction.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--space-sm) var(--space-md)',
                                        borderLeft: `2px solid ${transaction.type === 'CREDIT' ? 'var(--accent-aqua)' : 'var(--accent-coral)'}`,
                                        background: 'rgba(255, 255, 255, 0.01)'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{transaction.narration}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.6, display: 'flex', gap: '8px' }}>
                                                <span style={{ textTransform: 'uppercase' }}>{transaction.category}</span>
                                                <span>•</span>
                                                <span>{formatDate(transaction.date)}</span>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: transaction.type === 'CREDIT' ? 'var(--accent-aqua)' : 'var(--text-body)'
                                        }}>
                                            {transaction.type === 'CREDIT' ? "+" : "-"}{formatCurrency(transaction.amount)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
                            <div>
                                <h3 style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 'var(--letter-spacing-wide)',
                                    color: 'var(--text-primary)',
                                    marginBottom: 'var(--space-md)'
                                }}>
                                    SPEND ANALYSIS
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                    {loading ? (
                                        <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING ANALYTICS...</div>
                                    ) : categoryBreakdown.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>NO DATA AVAILABLE</div>
                                    ) : (
                                        categoryBreakdown.map((item, idx) => (
                                            <div key={idx}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                                                    <span>{item.category}</span>
                                                    <span style={{ opacity: 0.6 }}>{formatCurrency(item.amount)} ({item.percentage}%)</span>
                                                </div>
                                                <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                                                    <div style={{ height: '100%', width: `${item.percentage}%`, background: item.color }} />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                <div style={{ padding: 'var(--space-md)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>TOTAL ASSETS</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>
                                        {formatCurrency(netWorthData?.breakdown?.assets?.total || 0)}
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--space-md)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>TOTAL LIABILITIES</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px', color: 'var(--accent-coral)' }}>
                                        {formatCurrency(netWorthData?.breakdown?.liabilities?.total || 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
