import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { TicketStar } from "react-iconly";
import Avatar from "@/components/Avatar";
import Level from "@/components/Level";
import { Swiper, SwiperSlide } from "swiper/react";

interface PlayerProps {
  id: string;
  username: string;
  score: number;
  avatar: string;
  isBlocked: boolean;
}

const Player: FC<PlayerProps> = ({ avatar, username, score, isBlocked }) => {
  return (
    <PlayerStyle>
      <Avatar src={avatar} size={90} alt={username} username={username} link={!isBlocked} />
      <h5>{username}</h5>
      <div className="score">
        <Level score={score} size="sm" />
        <b>{score} xp</b>
      </div>
    </PlayerStyle>
  );
};

const PlayerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
  color: var(--text-100);
  :hover {
    background-color: var(--background-200);
    transition: background-color 0.2s ease-in-out;
  }
  h5 {
    margin-top: 10px;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-align: center;
  }
  .score {
    display: flex;
    align-items: center;
    gap: 8px;
    b {
      color: var(--text-300);
      font-weight: 400;
    }
  }
`;

const TopPlayers = () => {
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [laoding, setLaoding] = useState<boolean>(true);

  useEffect(() => {
    const getTopPlayers = async () => {
      try {
        await fetch(`${process.env.USERS}/getTopPlayers`, {
          method: "GET",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) =>
            setPlayers(
              data.map((player: any) => {
                return {
                  id: player?.id,
                  username: player?.login,
                  score: player?.score,
                  avatar: player?.avatarUrl,
                  isBlocked: player?.isBlocked,
                };
              })
            )
          );
      } catch (err) {}
    };
    getTopPlayers();
    setLaoding(false);
  }, []);

  return !players ? null : (
    <Style>
      <header>
        <TicketStar set="bold" primaryColor="#FAFF00" size={35} />
        <h1>Top 10 Players</h1>
      </header>
      {laoding ? (
        <>loading</>
      ) : (
        <div className="players">
          {players.length > 0 ? (
            <Swiper slidesPerView={"auto"}>
              {players.map((player, i) => (
                <SwiperSlide key={i}>
                  <Player {...player} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="no-content">No players found</p>
          )}
        </div>
      )}
    </Style>
  );
};
export default TopPlayers;

const Style = styled.section`
  header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 30px;
  }
  .swiper {
    overflow: visible;
  }
  .swiper-slide {
    width: 150px;
  }
`;
