"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface CreditCardProps {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cardType: string;
    balance: number;
    variant?: "primary" | "secondary" | "premium";
}

// Card network logos as SVG components
const VisaLogo = () => (
    <svg viewBox="0 0 48 16" className="h-6 w-auto" fill="white">
        <path d="M19.5 2.4l-3.6 11.2h-2.4L11.1 5.8c-.2-.6-.3-.8-.8-1-.8-.4-2.1-.7-3.2-.9l.1-.4h5.5c.7 0 1.3.5 1.5 1.2l1.4 7.4 3.4-8.6h2.5zm10 7.5c0-3-4.1-3.1-4.1-4.4 0-.4.4-.8 1.2-.9.4-.1 1.6-.1 2.8.5l.5-2.3c-.7-.2-1.6-.5-2.7-.5-2.9 0-4.9 1.5-4.9 3.7 0 1.6 1.4 2.5 2.5 3 1.1.6 1.5.9 1.5 1.4 0 .7-.9 1.1-1.7 1.1-1.4 0-2.2-.4-2.8-.7l-.5 2.4c.6.3 1.8.5 3 .5 3.1 0 5.2-1.5 5.2-3.8zm7.4 3.7h2.2l-1.9-11.2h-2c-.6 0-1.1.3-1.3.9l-4.6 10.3h2.9l.6-1.6h3.6l.5 1.6zm-3.1-3.8l1.5-4.1.9 4.1h-2.4zm-13.3-7.4l-2.3 11.2h-2.7l2.3-11.2h2.7z" />
    </svg>
);

const MastercardLogo = () => (
    <svg viewBox="0 0 48 32" className="h-8 w-auto" fill="none">
        <circle cx="18" cy="16" r="12" fill="#EB001B" />
        <circle cx="30" cy="16" r="12" fill="#F79E1B" />
        <path d="M24 8c-2.4 1.8-4 4.7-4 8s1.6 6.2 4 8c2.4-1.8 4-4.7 4-8s-1.6-6.2-4-8z" fill="#FF5F00" />
    </svg>
);

const AmexLogo = () => (
    <svg viewBox="0 0 48 16" className="h-6 w-auto" fill="white">
        <path d="M4.5 2h3.8l.9 2.1.9-2.1h3.8v8.4l2.8-8.4h3.4l2.8 8.4V2h3.8l.9 2.1.9-2.1h3.8l-3.4 6.5v3.9h-2.8V8.5l-3.4-6.5h-2.8l-2.8 8.4V2h-2.8l-2.8 8.4V2H7.3L4.5 8.5V2zm0 12.4h8.4v-2.8H7.3v-1.4h5.6v-2.8H7.3V6h5.6V3.2H4.5v11.2zm14 0h2.8v-8.4l2.8 8.4h2.8l2.8-8.4v8.4h2.8V3.2h-4.2l-2.8 8.4-2.8-8.4h-4.2v11.2zm14 0h8.4v-2.8h-5.6v-1.4h5.6v-2.8h-5.6V6h5.6V3.2h-8.4v11.2z" />
    </svg>
);

export function CreditCard3D({ cardNumber, cardHolder, expiryDate, cardType, balance, variant = "primary" }: CreditCardProps) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    const gradients = {
        primary: "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800",
        secondary: "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900",
        premium: "bg-gradient-to-br from-amber-500 via-orange-600 to-red-700",
    };

    // Determine which logo to show based on card type
    const CardLogo = cardType.toLowerCase().includes("visa") ? VisaLogo
        : cardType.toLowerCase().includes("master") ? MastercardLogo
            : cardType.toLowerCase().includes("amex") ? AmexLogo
                : null;

    return (
        <div
            className="relative w-full max-w-[400px] h-[240px] perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.1s ease-out",
                transformStyle: "preserve-3d",
            }}
        >
            <Card
                className={`w-full h-full p-6 ${gradients[variant]} text-white border-0 shadow-2xl relative overflow-hidden flex flex-col justify-between`}
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50" />

                {/* Top section: Chip and Logo */}
                <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md opacity-90 shadow-md" />
                    {CardLogo && <CardLogo />}
                </div>

                {/* Middle section: Card number */}
                <div className="relative z-10 font-mono text-xl tracking-[0.2em] mt-4">
                    {cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                </div>

                {/* Bottom section: Card holder, expiry, and balance */}
                <div className="flex justify-between items-end relative z-10">
                    <div className="flex-1">
                        <div className="text-[10px] opacity-70 mb-1 uppercase tracking-wider">Card Holder</div>
                        <div className="font-semibold text-sm uppercase tracking-wide">{cardHolder}</div>
                    </div>
                    <div className="mx-4">
                        <div className="text-[10px] opacity-70 mb-1 uppercase tracking-wider">Expires</div>
                        <div className="font-semibold text-sm">{expiryDate}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] opacity-70 mb-1 uppercase tracking-wider">Balance</div>
                        <div className="text-lg font-bold">${balance.toLocaleString()}</div>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            </Card>
        </div>
    );
}
