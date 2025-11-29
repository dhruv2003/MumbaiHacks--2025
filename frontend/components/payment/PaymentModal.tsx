"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upgrade to Premium</DialogTitle>
                    <DialogDescription>
                        Unlock unlimited chats and advanced artifacts.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="number">Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="number" placeholder="0000 0000 0000 0000" className="pl-9" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full" onClick={onClose}>
                        <Lock className="mr-2 h-4 w-4" /> Pay $20.00
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
