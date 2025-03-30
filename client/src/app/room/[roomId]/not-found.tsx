"use client";
import NotFound from "@/components/common/notFound/notFound";
import { NOT_FOUND_MESSAGES } from "@/constants/notFound.const";

const NotFoundPage = () => {
    return <NotFound message={NOT_FOUND_MESSAGES.room} />;
};

export default NotFoundPage;
