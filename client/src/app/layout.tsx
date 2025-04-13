import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import JotaiProvider from "@/jotai/jotaiProvider";
import ModalProvider from "@/components/modal/modalProvider/modalProvider";
import NewQueryProviders from "@/query/newQueryProvider";
import MsClarity from "./msClarity";
import "../styles/reset.css";
import "../styles/global.scss";
import { GoogleAnalytics } from "./googleAnalytics";

const noto_Sans_KR = Noto_Sans_KR({ weight: ["400", "700"], subsets: ["latin"] });

const timer = localFont({
    src: "../styles/timer.woff2",
    display: "swap",
    preload: true,
    variable: "--font-timer",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://meetsin.link"),
    title: {
        template: "%s | MEETSIN",
        default: "MEETSIN",
    },
    description: "스터디 및 협업을 위한 메타버스 플랫폼",
    openGraph: {
        type: "website",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "MEETSIN",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
    },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ko">
            <head>
                <GoogleAnalytics />
            </head>
            <body className={`${noto_Sans_KR.className} ${timer.variable}`}>
                <NewQueryProviders>
                    <JotaiProvider>
                        <ModalProvider>
                            {children}
                            <MsClarity />
                        </ModalProvider>
                    </JotaiProvider>
                </NewQueryProviders>
            </body>
        </html>
    );
};
export default RootLayout;
