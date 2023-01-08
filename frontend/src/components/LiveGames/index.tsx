import { useEffect, useState } from "react";
import { Game, ChevronLeft, ChevronRight } from "react-iconly";
import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Navigation, A11y } from "swiper";
import { useGame } from "@/src/context/gameSocket";
import { Style } from "./styles";
import { CardProps, Card } from "./Card";
import { toast } from "react-toastify";

SwiperCore.use([Navigation, A11y]);

const params = {
  navigation: {
    nextEl: ".next",
    prevEl: ".prev",
  },
};
const LiveGames = () => {
  const lives: CardProps[] = useGame()?.lives;

  return (
    <Style>
      <header>
        <div>
          <Game set="bulk" primaryColor="#F65164" size={35} />
          <h1>Live Games</h1>
        </div>
        {lives?.length > 0 && (
          <div>
            <button className="prev secondary">
              <ChevronLeft />
            </button>
            <button className="next secondary">
              <ChevronRight />
            </button>
          </div>
        )}
      </header>
      <div>
        {lives?.length > 0 ? (
          <Swiper
            slidesPerView={"auto"}
            centeredSlides={true}
            spaceBetween={7}
            loop={true}
            navigation={params.navigation}
          >
            {lives?.map(
              (live, i) =>
                live.players.length == 2 && (
                  <SwiperSlide key={i}>
                    <Card {...live} />
                  </SwiperSlide>
                )
            )}
          </Swiper>
        ) : (
          <div>
            <p className="no-content">No live games found</p>
          </div>
        )}
      </div>
    </Style>
  );
};
export default LiveGames;
