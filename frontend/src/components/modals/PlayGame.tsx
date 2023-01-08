import { FC, useEffect, useState } from "react";
import Modale from "@/layout/Modal";
import { Game } from "react-iconly";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper";
import Link from "next/link";
import SwiperCore from "swiper";
import Image from "next/image";

import { Props } from "./interface";
import Map1 from "@/images/maps/defaultMap.jpeg";
import Map2 from "@/images/maps/map_2.jpg";
import Map3 from "@/images/maps/map_3.jpg";
import Map4 from "@/images/maps/map_4.png";

export const maps = ["1337", "FarAway", "Iceland", "Miramar"];

const PlayGame: FC<Props> = ({ isOpen, setIsOpen, contentLabel }) => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [mapName, setMapName] = useState<string>(maps[0]);
  const [mapIndex, setMapIndex] = useState<number>(0);

  useEffect(() => {
    if (swiper) {
      swiper.on("slideChange", () => {
        setMapName(maps[swiper.activeIndex]);
        setMapIndex(swiper.activeIndex);
      });
    }
  }, [swiper]);

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <Style>
        <Swiper onSwiper={setSwiper} effect={"cards"} grabCursor={true} modules={[EffectCards]}>
          <SwiperSlide>
            <Image src={Map1} alt="Default" width={450} height={300} />
          </SwiperSlide>
          <SwiperSlide>
            <Image src={Map2} alt="FarAway" width={450} height={300} />
          </SwiperSlide>
          <SwiperSlide>
            <Image src={Map3} alt="Iceland" width={450} height={300} />
          </SwiperSlide>
          <SwiperSlide>
            <Image src={Map4} alt="Miramar" width={450} height={300} />
          </SwiperSlide>
        </Swiper>
        <h5>{mapName}</h5>
        <Link href={`/game?map=${mapIndex}`} className="btn lg">
          <Game set="bulk" />
          <span>Play Now</span>
        </Link>
      </Style>
    </Modale>
  );
};
export default PlayGame;

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .lg {
    margin-top: 30px;
    width: 100%;
  }
  .swiper {
    width: 450px;
    height: 300px;
  }
  .btn {
    max-width: 300px;
  }
  h5 {
    text-align: center;
    margin-top: 20px;
  }
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }

  img {
    object-fit: cover;
  }

  .swiper-slide:nth-child(1n) {
    background-color: rgb(0, 0, 0);
  }
`;
