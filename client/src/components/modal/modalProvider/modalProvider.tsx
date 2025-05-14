"use client";

import Lazy from "@/components/modal/lazy/lazy";
import { modalAtom } from "@/jotai/atom";
import { useAtomValue } from "jotai";

interface Props {
    children: React.ReactNode;
}

const ModalProvider = (props: Props) => {
    const modalState = useAtomValue(modalAtom);

    const modals = Object.keys(modalState).filter((item) => modalState[item].open);

    return (
        <>
            {modals.map((filename) => (
                <Lazy key={filename} filename={filename} />
            ))}
            {props.children}
        </>
    );
};

export default ModalProvider;
