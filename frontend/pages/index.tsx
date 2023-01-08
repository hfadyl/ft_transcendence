import { useEffect, useState } from "react";
import type { NextPage } from "next";
import styled from "styled-components";
import { toast } from "react-toastify";

import Head from "@/layout/Head";
import LiveGames from "@/components/LiveGames";
import TopPlayers from "@/components/TopPlayers";
import Rooms from "@/components/Rooms";
import Friends from "@/components/Friends";
import CallToAction from "@/components/CallToAction";
import { useGame } from "@/src/context/gameSocket";
import AchievementModal from "@/components/modals/AchievementModal";

const Home: NextPage = () => {
  const { achievements, setAchievements } = useGame();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (achievements?.length > 0) setModal(true);
    return () => {
      setAchievements([]);
    };
  }, []);

  return (
    <>
      <Head title="Home | Ping Pong Champion" />
      <Style>
        <Friends />
        <div className="container">
          <LiveGames />
          <TopPlayers />
          <Rooms />
        </div>
        <CallToAction />
        <AchievementModal
          isOpen={modal}
          setIsOpen={setModal}
          contentLabel="You have unlocked new achievements 🥳"
          achievements={achievements as string[]}
        />
      </Style>
    </>
  );
};

export default Home;

const Style = styled.main`
  margin-bottom: 50px;
  .container {
    display: flex;
    flex-direction: column;
    gap: 50px;
  }
`;
