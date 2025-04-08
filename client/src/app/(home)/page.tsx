import HomeContent from "@/components/home/homeContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "홈",
};

const Home = () => {
    return <HomeContent />;
};

export default Home; 