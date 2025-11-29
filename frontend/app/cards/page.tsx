"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import { getLiabilities, getProfile, formatCurrency } from "@/lib/api";

interface CardData {
    id: string;
    bankName: string;
    cardType: string;
    cardVariant: string;
    cardNumber: string;
    expiry: string;
    nameOnCard: string;
    limit: number;
    used: number;
    isCredit: boolean;
}

export default function CardsPage() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        setLoading(true);

        try {
            const [profileResult, liabilitiesResult] = await Promise.all([
                getProfile(),
                getLiabilities()
            ]);

            const userData = profileResult.data;
            const liabilitiesData = liabilitiesResult.data;

            if (userData && userData.creditCards && userData.creditCards.length > 0) {
                const userCards: CardData[] = userData.creditCards.map((card: any, index: number) => {
                    const liability = liabilitiesData?.liabilities?.find(
                        (l: any) => l.type === 'CREDIT_CARD' && l.lender === card.bankName
                    );

                    return {
                        id: `${index + 1}`,
                        bankName: card.bankName,
                        cardType: card.cardType,
                        cardVariant: card.cardVariant || 'Standard',
                        cardNumber: generateCardNumber(card.cardType),
                        expiry: '12/28',
                        nameOnCard: userData.name?.toUpperCase() || 'CARDHOLDER',
                        limit: liability?.principalAmount || 500000,
                        used: liability?.outstandingAmount || 0,
                        isCredit: true
                    };
                });

                setCards(userCards);
            }
        } catch (error) {
            console.error('Error loading cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCardNumber = (cardType: string): string => {
        const prefixes: Record<string, string> = {
            'VISA': '4',
            'MASTERCARD': '5',
            'RUPAY': '6',
            'AMEX': '3'
        };
        const prefix = prefixes[cardType] || '4';
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}234 5678 9012 ${randomDigits}`;
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 'var(--space-lg)' }}>
            <NavBar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-lg) var(--space-md)' }}>
                <h1 style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--letter-spacing-wide)',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-lg)',
                    paddingBottom: 'var(--space-sm)',
                    borderBottom: '1px solid var(--border-subtle)'
                }}>
                    MY CREDIT CARDS
                </h1>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>LOADING CARDS...</div>
                ) : cards.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-lg)', opacity: 0.5 }}>
                        NO CREDIT CARDS FOUND
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: 'var(--space-lg)'
                    }}>
                        {cards.map((card) => (
                            <CardMinimal key={card.id} card={card} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CardMinimal({ card }: { card: CardData }) {
    const utilizationPercent = (card.used / card.limit) * 100;
    const available = card.limit - card.used;

    return (
        <div style={{
            border: '1px solid var(--border-subtle)',
            borderLeft: `2px solid ${utilizationPercent > 75 ? 'var(--accent-coral)' : 'var(--accent-aqua)'}`,
            background: 'var(--bg-secondary)',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)'
        }}>
            {/* Card Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: 'var(--space-md)',
                borderBottom: '1px solid var(--border-subtle)'
            }}>
                <div>
                    <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                    }}>
                        {card.bankName}
                    </div>
                    <div style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing)',
                        color: 'var(--text-body)',
                        opacity: 0.6
                    }}>
                        {card.cardType} • {card.cardVariant}
                    </div>
                </div>
            </div>

            {/* Card Number */}
            <div>
                <div style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--letter-spacing-wide)',
                    color: 'var(--text-body)',
                    opacity: 0.6,
                    marginBottom: 'var(--space-sm)',
                    fontWeight: 700
                }}>
                    CARD NUMBER
                </div>
                <div style={{
                    fontSize: '1.1rem',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.1em',
                    color: 'var(--text-primary)',
                    fontWeight: 600
                }}>
                    {card.cardNumber.slice(0, 4)} •••• •••• {card.cardNumber.slice(-4)}
                </div>
            </div>

            {/* Cardholder & Expiry */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-md)'
            }}>
                <div>
                    <div style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing-wide)',
                        color: 'var(--text-body)',
                        opacity: 0.6,
                        marginBottom: '4px',
                        fontWeight: 700
                    }}>
                        CARDHOLDER
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        fontWeight: 600
                    }}>
                        {card.nameOnCard}
                    </div>
                </div>
                <div>
                    <div style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing-wide)',
                        color: 'var(--text-body)',
                        opacity: 0.6,
                        marginBottom: '4px',
                        fontWeight: 700
                    }}>
                        EXPIRES
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {card.expiry}
                    </div>
                </div>
            </div>

            {/* Credit Utilization */}
            <div style={{
                paddingTop: 'var(--space-md)',
                borderTop: '1px solid var(--border-subtle)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-sm)'
                }}>
                    <div style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing-wide)',
                        color: 'var(--text-body)',
                        opacity: 0.6,
                        fontWeight: 700
                    }}>
                        CREDIT LIMIT
                    </div>
                    <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {formatCurrency(card.limit)}
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                    width: '100%',
                    height: '2px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    marginBottom: 'var(--space-sm)'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(utilizationPercent, 100)}%`,
                        background: utilizationPercent > 75 ? 'var(--accent-coral)' : 'var(--accent-aqua)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem'
                }}>
                    <div style={{ opacity: 0.6 }}>
                        USED: <span style={{
                            fontWeight: 700,
                            color: utilizationPercent > 75 ? 'var(--accent-coral)' : 'var(--text-primary)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {formatCurrency(card.used)}
                        </span>
                    </div>
                    <div style={{ opacity: 0.6 }}>
                        AVAILABLE: <span style={{
                            fontWeight: 700,
                            color: 'var(--accent-aqua)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            {formatCurrency(available)}
                        </span>
                    </div>
                </div>

                <div style={{
                    marginTop: 'var(--space-sm)',
                    fontSize: '0.7rem',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: utilizationPercent > 75 ? 'var(--accent-coral)' : 'var(--accent-aqua)',
                    fontVariantNumeric: 'tabular-nums'
                }}>
                    {utilizationPercent.toFixed(1)}% UTILIZED
                </div>
            </div>
        </div>
    );
}
