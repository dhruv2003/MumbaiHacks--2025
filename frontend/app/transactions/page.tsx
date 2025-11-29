"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import { getTransactions, getMonthlySpending, formatCurrency, formatDate } from "@/lib/api";

interface Transaction {
    id: string;
    date: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    category: string;
    mode: string;
    narration: string;
    account: {
        bank: string;
        maskedNumber: string;
    };
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthlyData, setMonthlyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [totalCredits, setTotalCredits] = useState(0);
    const [totalDebits, setTotalDebits] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        try {
            // Fetch transactions with date range (May-Nov 2025 as per API data)
            const txnResult = await getTransactions({
                from: '2025-05-01',
                to: '2025-11-30',
                limit: 50
            });

            if (txnResult.success && txnResult.data) {
                setTransactions(txnResult.data.transactions || []);
                setTotalCredits(txnResult.data.totalCredits || 0);
                setTotalDebits(txnResult.data.totalDebits || 0);
            }

            // Fetch monthly spending
            const monthlyResult = await getMonthlySpending(6);
            if (monthlyResult.success && monthlyResult.data) {
                setMonthlyData(monthlyResult.data);
            }
        } catch (error) {
            console.error('Error loading transaction data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = selectedCategory === "all"
        ? transactions
        : transactions.filter(t => t.category === selectedCategory);

    const categories = Array.from(new Set(transactions.map(t => t.category)));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 'var(--space-lg)' }}>
            <NavBar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-lg) var(--space-md)' }}>

                {/* Stats Overview - Giant Numbers */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-lg)',
                    marginBottom: 'var(--space-lg)',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-body)',
                            marginBottom: 'var(--space-sm)',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            opacity: 0.6
                        }}>
                            TOTAL INCOME
                        </div>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            color: 'var(--accent-aqua)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {formatCurrency(totalCredits)}
                        </div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-body)',
                            marginBottom: 'var(--space-sm)',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            opacity: 0.6
                        }}>
                            TOTAL EXPENSES
                        </div>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            color: 'var(--accent-coral)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {formatCurrency(totalDebits)}
                        </div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-body)',
                            marginBottom: 'var(--space-sm)',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            opacity: 0.6
                        }}>
                            NET FLOW
                        </div>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            color: totalCredits - totalDebits >= 0 ? 'var(--accent-aqua)' : 'var(--accent-coral)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {formatCurrency(totalCredits - totalDebits)}
                        </div>
                    </div>
                </div>

                {/* Monthly Trends */}
                {monthlyData && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <h3 style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            color: 'var(--text-primary)',
                            borderBottom: '1px solid var(--border-subtle)',
                            paddingBottom: 'var(--space-sm)',
                            marginBottom: 'var(--space-md)'
                        }}>
                            MONTHLY SPENDING TRENDS
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)' }}>
                            {monthlyData.months && monthlyData.months.slice(0, 6).map((month: any, index: number) => (
                                <div key={index} style={{ padding: 'var(--space-sm)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ fontSize: '0.8rem', marginBottom: '8px', opacity: 0.8 }}>{month.month}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>{formatCurrency(month.totalSpent)}</div>
                                    <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', width: '100%' }}>
                                        <div style={{
                                            height: '100%',
                                            background: 'var(--accent-coral)',
                                            width: `${Math.min((month.totalSpent / (monthlyData.maxSpending || 1)) * 100, 100)}%`
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transactions List */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h3 style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--letter-spacing-wide)',
                            color: 'var(--text-primary)',
                            margin: 0
                        }}>
                            RECENT TRANSACTIONS
                        </h3>

                        {/* Minimal Filter Tabs */}
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto', paddingBottom: '4px' }}>
                            <button
                                onClick={() => setSelectedCategory("all")}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: selectedCategory === "all" ? '1px solid var(--accent-aqua)' : '1px solid transparent',
                                    color: selectedCategory === "all" ? 'var(--accent-aqua)' : 'var(--text-body)',
                                    padding: '4px 8px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    opacity: selectedCategory === "all" ? 1 : 0.6
                                }}
                            >
                                ALL
                            </button>
                            {categories.slice(0, 5).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: selectedCategory === cat ? '1px solid var(--accent-aqua)' : '1px solid transparent',
                                        color: selectedCategory === cat ? 'var(--accent-aqua)' : 'var(--text-body)',
                                        padding: '4px 8px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        opacity: selectedCategory === cat ? 1 : 0.6,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING DATA...</div>
                        ) : filteredTransactions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>NO TRANSACTIONS FOUND</div>
                        ) : (
                            filteredTransactions.map((txn) => (
                                <TransactionRow key={txn.id} transaction={txn} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
    const isCredit = transaction.type === "CREDIT";

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-sm) var(--space-md)',
            borderLeft: `2px solid ${isCredit ? 'var(--accent-aqua)' : 'var(--accent-coral)'}`,
            background: 'rgba(255, 255, 255, 0.01)',
            transition: 'background 0.2s ease'
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{transaction.narration}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, display: 'flex', gap: '8px' }}>
                    <span>{formatDate(transaction.date)}</span>
                    <span>/</span>
                    <span style={{ textTransform: 'uppercase' }}>{transaction.category}</span>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: isCredit ? 'var(--accent-aqua)' : 'var(--accent-coral)',
                    fontFamily: 'var(--font-primary)'
                }}>
                    {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>{transaction.mode}</div>
            </div>
        </div>
    );
}
