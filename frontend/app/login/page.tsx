"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BANKS, CARD_TYPES } from "@/lib/card-data";
import { login, register } from "@/lib/api";

// Schemas
const dependentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    age: z.coerce.number().min(0, "Age must be positive"),
    sex: z.enum(["MALE", "FEMALE", "OTHER"]),
    relationship: z.string().min(1, "Relationship is required")
});

const creditCardSchema = z.object({
    bankName: z.string().min(1, "Bank is required"),
    cardType: z.string().min(1, "Type is required"),
    cardVariant: z.string().min(1, "Variant is required")
});

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    pin: z.string().length(4, "PIN must be 4 digits"),
    dob: z.string().min(1, "DOB is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    dependents: z.array(dependentSchema).default([]),
    creditCards: z.array(creditCardSchema).default([]),
    goldGrams: z.coerce.number().min(0).default(0),
    silverGrams: z.coerce.number().min(0).default(0)
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Login Form
    const [loginData, setLoginData] = useState({ aaHandle: "", pin: "" });
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await login(loginData.aaHandle, loginData.pin);

            if (result.success) {
                router.push("/chat");
            } else {
                setError(result.error || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Signup Form
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema) as any,
        defaultValues: {
            dependents: [],
            creditCards: [],
            goldGrams: 0,
            silverGrams: 0
        }
    });

    const { fields: dependentFields, append: appendDependent, remove: removeDependent } = useFieldArray({
        control: form.control,
        name: "dependents"
    });

    const { fields: cardFields, append: appendCard, remove: removeCard } = useFieldArray({
        control: form.control,
        name: "creditCards"
    });

    const onSignup = async (data: SignupFormValues) => {
        setError("");
        setIsLoading(true);

        try {
            const result = await register(data);

            if (result.success) {
                router.push("/chat");
            } else {
                setError(result.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred during registration. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-lg) var(--space-unit)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '900px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                padding: 'var(--space-lg)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)', position: 'relative' }}>
                    <Link href="/" style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        textDecoration: 'none',
                        color: 'var(--text-body)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--letter-spacing)',
                        opacity: 0.7,
                        transition: 'opacity 0.2s ease',
                        padding: '6px 12px',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                    >
                        ← HOME
                    </Link>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        letterSpacing: 'var(--letter-spacing-wide)',
                        textTransform: 'uppercase',
                        color: 'var(--accent-coral)',
                        marginBottom: 'var(--space-sm)'
                    }}>
                        FINANCEHUB
                    </div>
                    <div style={{
                        fontSize: '0.95rem',
                        letterSpacing: 'var(--letter-spacing)',
                        textTransform: 'uppercase',
                        color: 'var(--text-body)',
                        opacity: 0.7
                    }}>
                        Login or Create Account
                    </div>
                </div>

                {/* Tab Selector */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: 'var(--space-lg)'
                }}>
                    <button
                        onClick={() => setActiveTab("login")}
                        style={{
                            flex: 1,
                            padding: 'var(--space-md)',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === "login" ? '2px solid var(--accent-coral)' : '2px solid transparent',
                            color: activeTab === "login" ? 'var(--accent-coral)' : 'var(--text-body)',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--letter-spacing)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        LOGIN
                    </button>
                    <button
                        onClick={() => setActiveTab("signup")}
                        style={{
                            flex: 1,
                            padding: 'var(--space-md)',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === "signup" ? '2px solid var(--accent-aqua)' : '2px solid transparent',
                            color: activeTab === "signup" ? 'var(--accent-aqua)' : 'var(--text-body)',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--letter-spacing)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        SIGN UP
                    </button>
                </div>

                {/* Login Tab */}
                {activeTab === "login" && (
                    <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
                        {error && (
                            <div style={{
                                padding: 'var(--space-sm)',
                                marginBottom: 'var(--space-md)',
                                border: '1px solid var(--accent-coral)',
                                color: 'var(--accent-coral)',
                                fontSize: '0.85rem'
                            }}>
                                {error}
                            </div>
                        )}
                        
                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing-wide)',
                                color: 'var(--text-body)',
                                marginBottom: 'var(--space-sm)',
                                opacity: 0.8
                            }}>
                                USERNAME / AA HANDLE
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 9876543210@anumati"
                                value={loginData.aaHandle}
                                onChange={(e) => setLoginData({ ...loginData, aaHandle: e.target.value })}
                                required
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-sm) 0',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-coral)'}
                                onBlur={(e) => e.target.style.borderBottomColor = 'var(--border-subtle)'}
                            />
                        </div>

                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing-wide)',
                                color: 'var(--text-body)',
                                marginBottom: 'var(--space-sm)',
                                opacity: 0.8
                            }}>
                                PIN
                            </label>
                            <input
                                type="password"
                                placeholder="4-digit PIN"
                                maxLength={4}
                                value={loginData.pin}
                                onChange={(e) => setLoginData({ ...loginData, pin: e.target.value })}
                                required
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-sm) 0',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-coral)'}
                                onBlur={(e) => e.target.style.borderBottomColor = 'var(--border-subtle)'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: 'var(--space-md)',
                                background: 'transparent',
                                border: '1px solid var(--accent-coral)',
                                borderRadius: '2px',
                                color: 'var(--accent-coral)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.5 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isLoading ? "LOGGING IN..." : "LOGIN"}
                        </button>
                    </form>
                )}

                {/* Signup Tab */}
                {activeTab === "signup" && (
                    <form onSubmit={form.handleSubmit(onSignup as any)} style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {error && (
                            <div style={{
                                padding: 'var(--space-sm)',
                                marginBottom: 'var(--space-md)',
                                border: '1px solid var(--accent-coral)',
                                color: 'var(--accent-coral)',
                                fontSize: '0.85rem'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Personal Details */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: 'var(--space-md)',
                            marginBottom: 'var(--space-lg)'
                        }}>
                            {[
                                { name: "name", label: "FULL NAME", placeholder: "Rahul Sharma", type: "text" },
                                { name: "email", label: "EMAIL", placeholder: "rahul@example.com", type: "email" },
                                { name: "phone", label: "PHONE", placeholder: "9876543210", type: "text", maxLength: 10 },
                                { name: "dob", label: "DATE OF BIRTH", placeholder: "", type: "date" },
                                { name: "pan", label: "PAN NUMBER", placeholder: "ABCDE1234F", type: "text", maxLength: 10 },
                                { name: "pin", label: "SET PIN", placeholder: "4-digit PIN", type: "password", maxLength: 4 }
                            ].map((field) => (
                                <div key={field.name}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: 'var(--letter-spacing-wide)',
                                        color: 'var(--text-body)',
                                        marginBottom: 'var(--space-sm)',
                                        opacity: 0.8
                                    }}>
                                        {field.label}
                                    </label>
                                    <input
                                        {...form.register(field.name as any)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        maxLength={field.maxLength}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-sm) 0',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-aqua)'}
                                        onBlur={(e) => e.target.style.borderBottomColor = 'var(--border-subtle)'}
                                    />
                                    {form.formState.errors[field.name as keyof typeof form.formState.errors] && (
                                        <p style={{ color: 'var(--accent-coral)', fontSize: '0.75rem', marginTop: '4px' }}>
                                            {String(form.formState.errors[field.name as keyof typeof form.formState.errors]?.message)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Address Section */}
                        <div style={{
                            paddingTop: 'var(--space-lg)',
                            borderTop: '1px solid var(--border-subtle)',
                            marginBottom: 'var(--space-lg)'
                        }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing-wide)',
                                color: 'var(--text-primary)',
                                marginBottom: 'var(--space-md)'
                            }}>
                                ADDRESS DETAILS
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: 'var(--space-md)'
                            }}>
                                {[
                                    { name: "address", label: "ADDRESS LINE", placeholder: "123, Sector 5", colSpan: true },
                                    { name: "city", label: "CITY", placeholder: "Mumbai" },
                                    { name: "state", label: "STATE", placeholder: "Maharashtra" },
                                    { name: "pincode", label: "PINCODE", placeholder: "400001", maxLength: 6 }
                                ].map((field) => (
                                    <div key={field.name} style={{ gridColumn: field.colSpan ? '1 / -1' : 'auto' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: 'var(--letter-spacing-wide)',
                                            color: 'var(--text-body)',
                                            marginBottom: 'var(--space-sm)',
                                            opacity: 0.8
                                        }}>
                                            {field.label}
                                        </label>
                                        <input
                                            {...form.register(field.name as any)}
                                            type="text"
                                            placeholder={field.placeholder}
                                            maxLength={field.maxLength}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-sm) 0',
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: '1px solid var(--border-subtle)',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-aqua)'}
                                            onBlur={(e) => e.target.style.borderBottomColor = 'var(--border-subtle)'}
                                        />
                                        {form.formState.errors[field.name as keyof typeof form.formState.errors] && (
                                            <p style={{ color: 'var(--accent-coral)', fontSize: '0.75rem', marginTop: '4px' }}>
                                                {String(form.formState.errors[field.name as keyof typeof form.formState.errors]?.message)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Precious Metals */}
                        <div style={{
                            paddingTop: 'var(--space-lg)',
                            borderTop: '1px solid var(--border-subtle)',
                            marginBottom: 'var(--space-lg)'
                        }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing-wide)',
                                color: 'var(--text-primary)',
                                marginBottom: 'var(--space-md)'
                            }}>
                                PRECIOUS METALS
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: 'var(--space-md)'
                            }}>
                                {[
                                    { name: "goldGrams", label: "GOLD (GRAMS)", placeholder: "0" },
                                    { name: "silverGrams", label: "SILVER (GRAMS)", placeholder: "0" }
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: 'var(--letter-spacing-wide)',
                                            color: 'var(--text-body)',
                                            marginBottom: 'var(--space-sm)',
                                            opacity: 0.8
                                        }}>
                                            {field.label}
                                        </label>
                                        <input
                                            {...form.register(field.name as any)}
                                            type="number"
                                            placeholder={field.placeholder}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-sm) 0',
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: '1px solid var(--border-subtle)',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-aqua)'}
                                            onBlur={(e) => e.target.style.borderBottomColor = 'var(--border-subtle)'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: 'var(--space-md)',
                                background: 'transparent',
                                border: '1px solid var(--accent-aqua)',
                                borderRadius: '2px',
                                color: 'var(--accent-aqua)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--letter-spacing)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.5 : 1,
                                transition: 'all 0.3s ease',
                                marginTop: 'var(--space-lg)'
                            }}
                        >
                            {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
