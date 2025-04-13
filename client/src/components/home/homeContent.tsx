"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/common/button/button";
import useModal from "@/components/modal/hooks/useModal";
import { LANDING_CONTENTS } from "@/constants/landing.const";
import style from "../../app/style.module.scss";

const HomeContent = () => {
    const { onOpen } = useModal("login");
    const [currentIndex, setCurrentIndex] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout>();
    useEffect(() => {
        startCarousel();

        return () => {
            stopCarousel();
        };
    }, []);

    const startCarousel = () => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % LANDING_CONTENTS.length);
        }, 5000);
    };
    const stopCarousel = () => {
        clearInterval(intervalRef.current);
    };

    return (
        <div className={style.container}>
            <section className={`${style.landing_section}`}>
                <h2 className={style.landing_title}>실시간 소통과 맵 탐험을 한 번에 즐겨보세요.</h2>
                <Button type="button" look="solid" text="시작하기 →" width={143} onClick={onOpen} />
            </section>
            <section className={style.carousel_section}>
                <AnimatePresence mode="popLayout">
                    <div className={style.carousel_card_container}>
                        <motion.div
                            key={currentIndex}
                            className={style.carousel_card}
                            initial={{ opacity: 0.5, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0.5, y: -200 }}
                            transition={{
                                y: { type: "tween", duration: 0.8 },
                                opacity: { duration: 0.8 },
                            }}
                            onMouseOver={stopCarousel}
                            onMouseLeave={startCarousel}
                        >
                            <Image
                                src={LANDING_CONTENTS[currentIndex].image}
                                className={style.carousel_image}
                                width={500}
                                height={300}
                                alt=""
                                priority
                                quality={75}
                            />
                            <div className={style.carousel_text}>
                                <p className={style.carousel_text_title}>
                                    {LANDING_CONTENTS[currentIndex].title}
                                </p>
                                <p className={style.carousel_text_description}>
                                    {LANDING_CONTENTS[currentIndex].description}
                                </p>
                            </div>
                        </motion.div>
                        <ol className={style.carousel_navigator}>
                            {LANDING_CONTENTS.map((content, index) => {
                                return (
                                    <li
                                        className={`${style.carousel_navigator_item} ${
                                            currentIndex === index && style.active
                                        }`}
                                        onClick={() => setCurrentIndex(index)}
                                        key={index}
                                    />
                                );
                            })}
                        </ol>
                    </div>
                </AnimatePresence>
            </section>
        </div>
    );
};

export default HomeContent;