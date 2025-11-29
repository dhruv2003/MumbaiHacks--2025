"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import { getNetWorth, getInvestments, getLiabilities, formatCurrency } from "@/lib/api";

interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    category: string;
}

export default function NetWorthPage() {
    const [netWorthData, setNetWorthData] = useState<any>(null);
    const [investments, setInvestments] = useState<any>(null);
    const [liabilities, setLiabilities] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("assets");

    // Sample goals
    const [goals] = useState<Goal[]>([
        {
            id: "1",
            title: "Save for a Car",
            target: 800000,
            current: 450000,
            category: "Purchase"
        },
        {
            id: "2",
            title: "Emergency Fund (6 months)",
            target: 600000,
            current: 380000,
            category: "Savings"
        },
        {
            id: "3",
            title: "Vacation to Europe",
            target: 300000,
            current: 125000,
            category: "Lifestyle"
        },
        {
            id: "4",
            title: "Home Down Payment",
            target: 2000000,
            current: 850000,
            category: "Investment"
        }
    ]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        try {
            const [netWorthResult, investmentsResult, liabilitiesResult] = await Promise.all([
                getNetWorth(),
                getInvestments(),
                getLiabilities()
            ]);

            if (netWorthResult.success && netWorthResult.data) {
                setNetWorthData(netWorthResult.data);
            }

            if (investmentsResult.success && investmentsResult.data) {
                setInvestments(investmentsResult.data);
            }

            if (liabilitiesResult.success && liabilitiesResult.data) {
                setLiabilities(liabilitiesResult.data);
            }
        } catch (error) {
            console.error('Error loading net worth data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalAssets = netWorthData?.breakdown?.assets?.total || 0;
    const totalLiabilities = netWorthData?.breakdown?.liabilities?.total || 0;
    const netAssets = netWorthData?.breakdown?.netAssets || 0;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 'var(--space-lg)' }}>
            <NavBar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-lg) var(--space-md)' }}>

                {/* Net Worth Overview - Giant Number */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
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
                        fontSize: '5rem',
                        fontWeight: 700,
                        color: netAssets >= 0 ? 'var(--accent-aqua)' : 'var(--accent-coral)',
                        fontVariantNumeric: 'tabular-nums',
                        marginBottom: 'var(--space-lg)'
                    }}>
                        {loading ? "LOADING..." : formatCurrency(netAssets)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xl)' }}>
                        <div>
                            <div style={{
                                fontSize: '0.7rem',
                                opacity: 0.6,
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing-wide)',
                                fontWeight: 700
                            }}>
                                TOTAL ASSETS
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--accent-aqua)',
                                fontVariantNumeric: 'tabular-nums'
                            }}>
                                {formatCurrency(totalAssets)}
                            </div>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
                        <div>
                            <div style={{
                                fontSize: '0.7rem',
                                opacity: 0.6,
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing-wide)',
                                fontWeight: 700
                            }}>
                                TOTAL LIABILITIES
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--accent-coral)',
                                fontVariantNumeric: 'tabular-nums'
                            }}>
                                {formatCurrency(totalLiabilities)}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>

                    {/* Asset Allocation */}
                    <div>
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
                            ASSET ALLOCATION
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {netWorthData?.breakdown?.assets && (
                                <>
                                    <AssetBar
                                        label="BANK ACCOUNTS"
                                        amount={netWorthData.breakdown.assets.bankAccounts}
                                        total={totalAssets}
                                        color="var(--accent-aqua)"
                                    />
                                    <AssetBar
                                        label="INVESTMENTS"
                                        amount={netWorthData.breakdown.assets.investments}
                                        total={totalAssets}
                                        color="var(--accent-coral)"
                                    />
                                    <AssetBar
                                        label="FIXED DEPOSITS"
                                        amount={netWorthData.breakdown.assets.fixedDeposits}
                                        total={totalAssets}
                                        color="#F5F5F5"
                                    />
                                    {netWorthData.breakdown.assets.preciousMetals > 0 && (
                                        <AssetBar
                                            label="PRECIOUS METALS"
                                            amount={netWorthData.breakdown.assets.preciousMetals}
                                            total={totalAssets}
                                            color="#FFD700"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Financial Goals */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-sm)' }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing-wide)',
                                color: 'var(--text-primary)',
                                margin: 0
                            }}>
                                FINANCIAL GOALS
                            </h3>
                            <button style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-body)', padding: '2px 8px', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer' }}>ADD GOAL</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {goals.map((goal) => (
                                <GoalCard key={goal.id} goal={goal} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown Tabs */}
                <div style={{ marginTop: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-md)' }}>
                        {['assets', 'investments', 'liabilities', 'metals'].map((tab) => (
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
                                {tab === 'metals' ? 'PRECIOUS METALS' : tab}
                            </button>
                        ))}
                    </div>

                    <div>
                        {activeTab === 'assets' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-md)' }}>
                                <StatCard
                                    title="BANK ACCOUNTS"
                                    value={formatCurrency(netWorthData?.breakdown?.assets?.bankAccounts || 0)}
                                    subtitle={`${netWorthData?.accounts?.savings || 0} SAVINGS, ${netWorthData?.accounts?.current || 0} CURRENT`}
                                />
                                <StatCard
                                    title="INVESTMENTS"
                                    value={formatCurrency(netWorthData?.breakdown?.assets?.investments || 0)}
                                    subtitle={`${netWorthData?.accounts?.investments || 0} INVESTMENT ACCOUNTS`}
                                />
                                <StatCard
                                    title="FIXED DEPOSITS"
                                    value={formatCurrency(netWorthData?.breakdown?.assets?.fixedDeposits || 0)}
                                    subtitle="LONG-TERM SAVINGS"
                                />
                            </div>
                        )}

                        {activeTab === 'investments' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING INVESTMENTS...</div>
                                ) : investments?.investments && investments.investments.length > 0 ? (
                                    investments.investments.map((inv: any, index: number) => (
                                        <InvestmentRow key={index} investment={inv} />
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>NO INVESTMENTS FOUND</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'liabilities' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING LIABILITIES...</div>
                                ) : liabilities?.liabilities && liabilities.liabilities.length > 0 ? (
                                    liabilities.liabilities.map((liab: any, index: number) => (
                                        <LiabilityRow key={index} liability={liab} />
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>NO LIABILITIES FOUND</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'metals' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
                                {netWorthData?.preciousMetals && (
                                    <>
                                        <MetalCard
                                            type="GOLD"
                                            grams={netWorthData.preciousMetals.gold.grams}
                                            rate={netWorthData.preciousMetals.gold.ratePerGram}
                                            value={netWorthData.preciousMetals.gold.value}
                                            color="#FFD700"
                                        />
                                        <MetalCard
                                            type="SILVER"
                                            grams={netWorthData.preciousMetals.silver.grams}
                                            rate={netWorthData.preciousMetals.silver.ratePerGram}
                                            value={netWorthData.preciousMetals.silver.value}
                                            color="#C0C0C0"
                                        />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AssetBar({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
    const percentage = total > 0 ? (amount / total) * 100 : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ opacity: 0.8 }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(amount)}</span>
            </div>
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ height: '100%', width: `${percentage}%`, background: color }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.7rem', opacity: 0.5 }}>{percentage.toFixed(1)}%</div>
        </div>
    );
}

function GoalCard({ goal }: { goal: Goal }) {
    const progress = (goal.current / goal.target) * 100;
    const remaining = goal.target - goal.current;

    return (
        <div style={{
            padding: 'var(--space-md)',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.01)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{goal.title}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', border: '1px solid var(--border-subtle)', padding: '2px 6px' }}>{goal.category}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ opacity: 0.6 }}>PROGRESS</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-aqua)' }}>{progress.toFixed(1)}%</span>
            </div>

            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', marginBottom: 'var(--space-sm)' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-aqua)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ opacity: 0.6 }}>CURRENT: {formatCurrency(goal.current)}</span>
                <span style={{ opacity: 0.6 }}>TARGET: {formatCurrency(goal.target)}</span>
            </div>

            <div style={{ marginTop: 'var(--space-sm)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', opacity: 0.5 }}>
                {formatCurrency(remaining)} REMAINING
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
    return (
        <div style={{
            padding: 'var(--space-md)',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.01)'
        }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>{title}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>{subtitle}</div>
        </div>
    );
}

function InvestmentRow({ investment }: { investment: any }) {
    const isPositive = investment.returns >= 0;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-sm) var(--space-md)',
            borderLeft: '2px solid var(--accent-aqua)',
            background: 'rgba(255, 255, 255, 0.01)',
            transition: 'background 0.2s ease'
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'}
        >
            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{investment.schemeName}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, display: 'flex', gap: '8px' }}>
                    <span style={{ textTransform: 'uppercase' }}>{investment.type}</span>
                    <span>•</span>
                    <span>INVESTED: {formatCurrency(investment.investedAmount)}</span>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(investment.currentValue)}</div>
                <div style={{
                    fontSize: '0.8rem',
                    color: isPositive ? 'var(--accent-aqua)' : 'var(--accent-coral)',
                    fontWeight: 600
                }}>
                    {isPositive ? '+' : ''}{investment.returnsPercentage.toFixed(2)}%
                </div>
            </div>
        </div>
    );
}

function LiabilityRow({ liability }: { liability: any }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-sm) var(--space-md)',
            borderLeft: '2px solid var(--accent-coral)',
            background: 'rgba(255, 255, 255, 0.01)',
            transition: 'background 0.2s ease'
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'}
        >
            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{liability.lender}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, display: 'flex', gap: '8px' }}>
                    <span style={{ textTransform: 'uppercase' }}>{liability.type}</span>
                    <span>•</span>
                    <span>EMI: {formatCurrency(liability.emiAmount)}</span>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-coral)' }}>{formatCurrency(liability.outstandingAmount)}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>PRINCIPAL: {formatCurrency(liability.principalAmount)}</div>
            </div>
        </div>
    );
}

function MetalCard({ type, grams, rate, value, color }: { type: string; grams: number; rate: number; value: number; color: string }) {
    return (
        <div style={{
            padding: 'var(--space-md)',
            border: `1px solid var(--border-subtle)`,
            borderLeft: `2px solid ${color}`,
            background: 'var(--bg-secondary)'
        }}>
            <div style={{
                fontSize: '0.7rem',
                color: color,
                marginBottom: 'var(--space-sm)',
                letterSpacing: 'var(--letter-spacing-wide)',
                textTransform: 'uppercase',
                fontWeight: 700
            }}>
                {type} HOLDINGS
            </div>
            <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '4px',
                fontVariantNumeric: 'tabular-nums'
            }}>
                {grams}g
            </div>
            <div style={{
                fontSize: '0.75rem',
                opacity: 0.6,
                marginBottom: 'var(--space-md)',
                textTransform: 'uppercase'
            }}>
                RATE: {formatCurrency(rate)}/G
            </div>
            <div style={{
                borderTop: `1px solid var(--border-subtle)`,
                paddingTop: 'var(--space-sm)',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums'
            }}>
                TOTAL: {formatCurrency(value)}
            </div>
        </div>
    );
}
