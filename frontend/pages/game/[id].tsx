import { useEffect, useState, useRef } from "react";
import type { NextPage } from "next";
import styled from "styled-components";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Modal from "react-modal";

import Head from "@/layout/Head";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useAuth } from "@/src/context/auth";
import { useGame } from "@/src/context/gameSocket";
import Canvas from "@/components/Canvas";
import Players from "@/components/Players";
import MapData from "@/components/MapData";
import { maps } from "@/components/modals/PlayGame";

Modal.setAppElement("#__next");

const Home: NextPage = () => {
  const [player1, setPlayer1] = useState<any>(null);
  const [player2, setPlayer2] = useState<any>(null);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [boardData, setBoardData] = useState<any>(null);
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);
  const size = useWindowSize();
  const [views, Setviews] = useState(0);

  const router = useRouter();
  let { map, id, requestType } = router.query;
  const user = useAuth()?.user;
  const socket = useGame()?.socket;
  const hasRun = useRef<boolean>(false);

  useEffect(() => {
    if (!user || !socket || hasRun.current) return;
    hasRun.current = true;
    if (requestType === "toWatch") {
      socket.emit("joinRoom_F", user, id, "toWatch");
      socket?.off("alreadyInRoom").on("alreadyInRoom", () => {
        toast.error("You are already watching this game");
        router.push("/");
      });
    } else if (requestType === "invited") socket.emit("joinRoom_F", user, id, "invited");

    return () => {
      socket.off("alreadyInRoom");
    };
  }, [requestType, user, socket, id]);

  useEffect(() => {
    if (!user || !socket) return;
    if (requestType === "toWatch") {
      socket.off("roomRemoved").on("roomRemoved", (data) => {
        router.push("/");
        toast.error("You have been removed from the room");
      });
    }
    return () => {
      socket.off("roomRemoved");
    };
  }, [user, socket, router]);

  const handleLeave = () => {
    if (socket && user) {
      socket.emit("unmount", user);
      socket.off("boardData_B");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.off("updateViewsNb").on("updateViewsNb", (views) => {
      // console.log("updateViewsNb: ", views);
      Setviews(views);
    });
    return () => {
      socket.off("updateViewsNb");
    };
  }, [socket]);

  const handleRequest = () => {
    if (!socket) return;

    socket.emit("requestBoardData", id);
    socket.off("boardData_B").on("boardData_B", (data, player1, player2) => {
      setLeftScore(data.leftScore);
      setRightScore(data.rightScore);
      setBoardData(data);
      setPlayer1(player1);
      setPlayer2(player2);
      Setviews(data.views);
    });

    socket
      ?.off("updateScore")
      .on("updateScore", (leftScore, rightScore, player1Points, player2Points) => {
        setLeftScore(leftScore);
        setRightScore(rightScore);
        setPlayer1Points(player1Points);
        setPlayer2Points(player2Points);
      });
  };

  useEffect(() => {
    handleRequest();
    return () => {
      handleLeave();
    };
  }, []);

  useEffect(() => {
    socket?.off("roomNotFound").on("roomNotFound", (data) => {
      router.push("/");
      toast.error("Room not found");
    });

    return () => {
      socket?.off("roomRemoved");
      socket?.off("roomNotFound");
      socket?.off("boardData_B");
    };
  }, [user, socket, router]);

  if (!boardData) return <h1>No data</h1>;

  return (
    <>
      <Head title="Game | Ping Pong Champion" />
      <Style>
        <Players
          player1={player1}
          player2={player2}
          frontWidth={size.width}
          leftScore={leftScore}
          rightScore={rightScore}
          player1Points={player1Points}
          player2Points={player2Points}
        />
        <Canvas
          frontWidth={size.width}
          user={user}
          data={boardData}
          setData={setBoardData}
          requestType={requestType}
        />
        <MapData
          views={views}
          mapName={maps[parseInt(map as string) || 0]}
          frontWidth={size.width}
        />
      </Style>
    </>
  );
};

export default Home;

const Style = styled.main`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
