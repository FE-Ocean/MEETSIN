import Image from "next/image";
import { useAtom } from "jotai";
import { zoomLevelAtom } from "@/jotai/atom";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from "@/constants/zoomLevel.const";
import style from "./mapZoomButtons.module.scss";

const MapZoomButtons = () => {
    const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);

    const handleZoomIn = () => {
        if (zoomLevel < MAX_ZOOM_LEVEL) setZoomLevel(zoomLevel + 1);
    };

    const handleZoomOut = () => {
        if (zoomLevel > MIN_ZOOM_LEVEL) setZoomLevel(zoomLevel - 1);
    };

    return (
        <div className={style.container}>
            <button
                className={style.zoom_in}
                onClick={handleZoomIn}
                disabled={zoomLevel === MAX_ZOOM_LEVEL}
            >
                <Image src={"/icons/zoom_in.svg"} width={12} height={12} alt="맵 확대" />
            </button>
            <button
                className={style.zoom_out}
                onClick={handleZoomOut}
                disabled={zoomLevel === MIN_ZOOM_LEVEL}
            >
                <Image src={"/icons/zoom_out.svg"} width={12} height={12} alt="맵 축소" />
            </button>
        </div>
    );
};

export default MapZoomButtons;
