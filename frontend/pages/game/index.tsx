import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useGame } from "@/src/context/gameSocket";
import { useAuth } from "@/src/context/auth";
import Head from "@/layout/Head";
import styled from "styled-components";
import { toast } from "react-toastify";

const Game: NextPage = () => {
  const [state, setState] = useState<string>("Waiting for a match...");
  const router = useRouter();
  const socket = useGame()?.socket;
  const user = useAuth()?.user;
  const hasRun = useRef<boolean>(false);
  const isLeaving = useRef<boolean>(true);
  let { map, id, requestType } = router.query;

  useEffect(() => {
    if (user && socket) {
      if (hasRun.current) return;
      hasRun.current = true;

      if (requestType === "toInvite") {
        socket.emit("joinRoom_F", user, "", "toInvite");
        // setTimeout(() => {
        //   if (isLeaving.current) {
        //     socket.emit("unmount", user);
        //     toast.info("invitation expired");
        //     router.push("/");
        //   }
        // }, 10000);
      } else if (requestType === "invited") {
        socket.emit("joinRoom_F", user, id, "invited");
      } else {
        socket.emit("joinRoom_F", user, "", "toPlay");
      }

      socket.off("availableRoom").on("availableRoom", (id: string) => {
        isLeaving.current = false;
        setState("you got matched, redirecting...");
        router.push(`/game/${id}?map=${map || "default"}`);
      });

      socket.off("alreadyInGame").on("alreadyInGame", () => {
        isLeaving.current = false;
        toast.error("You are already in a game");
        router.push("/");
      });
    }
  }, [user, socket, map]);

  useEffect(() => {
    return () => {
      socket?.off("availableRoom");
      if (isLeaving.current) {
        socket?.emit("unmount", user);
        // console.log("unmount Queue /game", socket);
      }
    };
  }, [socket]);

  return (
    <>
      <Head title="Login | Ping Pong Champion" />

      <Style>
        <div className="spinner-loader">
          <svg className="raquet" id="r-1">
            <ellipse className="front" cx="44" cy="50" rx="35" ry="50" />
            <ellipse className="middle" cx="42" cy="50" rx="35" ry="50" />
            <ellipse className="back" cx="40" cy="50" rx="35" ry="50" />
            <rect className="handle outer" x="40" y="100" width="10" height="42" />
            <rect className="handle inner" x="38" y="100" width="10" height="41" />
            <rect className="handle outer" x="35" y="100" width="10" height="40" />
            <ellipse className="shadow" id="sor-1" cx="40" cy="50" rx="7" ry="10" />
          </svg>
          <svg className="raquet" id="r-2">
            <ellipse className="back" cx="40" cy="50" rx="35" ry="50" />
            <ellipse className="middle" cx="42" cy="50" rx="35" ry="50" />
            <ellipse className="front" cx="44" cy="50" rx="35" ry="50" />
            <rect className="handle outer" x="35" y="100" width="10" height="42" />
            <rect className="handle inner" x="37" y="100" width="10" height="41" />
            <rect className="handle outer" x="40" y="100" width="10" height="40" />
            <ellipse className="shadow" id="sor-2" cx="44" cy="50" rx="7" ry="10" />
          </svg>
          <div className="ball-container">
            <svg className="ball">
              <circle cx="20" cy="20" r="12" />
            </svg>
          </div>
          <svg className="shadow">
            <ellipse id="sr-1" cx="70" cy="30" rx="50" ry="15" />
            <ellipse id="sb" cx="150" cy="30" rx="15" ry="4.5" />
            <ellipse id="sr-2" cx="230" cy="30" rx="50" ry="15" />
          </svg>
        </div>
        <h1>{state}</h1>
      </Style>
    </>
  );
};
export default Game;

const Style = styled.main`
  position: relative;

  h1 {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
`;
