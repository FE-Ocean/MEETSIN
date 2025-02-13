import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import JotaiProvider from "@/jotai/jotaiProvider";
import ModalProvider from "@/components/modal/modalProvider/modalProvider";
import NewQueryProviders from "@/query/newQueryProvider";
import Analysis from "./analysis";
import "../styles/reset.css";
import "../styles/global.scss";

const noto_Sans_KR = Noto_Sans_KR({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MEETSIN",
    description: "실시간 소통과 맵 탐험을 한 번에 즐겨보세요.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ko">
            <body className={noto_Sans_KR.className}>
                <NewQueryProviders>
                    <JotaiProvider>
                        <ModalProvider>
                            {children}
                            <Analysis />
                        </ModalProvider>
                    </JotaiProvider>
                </NewQueryProviders>
            </body>
        </html>
    );
};
export default RootLayout;
