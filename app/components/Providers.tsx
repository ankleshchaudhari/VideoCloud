"use client"

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "./Notification";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

const authenticator = async () => {
    try {
        const response = await fetch("/api/auth/imagekit-auth");
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        const { signature, expire, token } = data.authenticationParameters;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchInterval={5 * 60}>
            <ImageKitProvider
                urlEndpoint={urlEndPoint}
                publicKey={publicKey}
                authenticator={authenticator}
            >
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </ThemeProvider>
            </ImageKitProvider>
        </SessionProvider>
    );
}