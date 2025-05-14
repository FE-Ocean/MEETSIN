import useModal from "@/components/modal/hooks/useModal";
import dynamic from "next/dynamic";

interface Props {
    filename: string;
}

interface DynamicComponent {
    onClose: () => void;
}

const Lazy = (props: Props) => {
    const { filename } = props;

    const { onClose } = useModal(filename);

    const Component = dynamic<DynamicComponent>(
        () => import(`../../modals/${filename}/${filename}.tsx`),
    );

    return <Component onClose={onClose} />;
};

export default Lazy;
