import dynamic from "next/dynamic";
import p5Types from "p5";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGame } from "@/src/context/gameSocket";
import { GameOver } from "@/components/modals/GameOver";
import styled from "styled-components";
import { useSound } from "use-sound";
import Link from "next/link";
import Image from "next/image";

import Map1 from "@/images/maps/defaultMap.jpeg";
import Map2 from "@/images/maps/map_2.jpg";
import Map3 from "@/images/maps/map_3.jpg";
import Map4 from "@/images/maps/map_4.png";

const _maps = [Map1, Map2, Map3, Map4];

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import("react-p5"), {
  ssr: false,
});

let canvasWidth: number;
let canvasHeight: number;
let plyRcolor: string;
let plyLcolor: string;
let coefficent: number;

interface Props {
  frontWidth: number;
  // mapBg: any;
  user: any;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  requestType: any;
}

const Canvas: React.FC<Props> = ({
  // mapBg,
  frontWidth,
  user,
  data,
  setData,

  requestType = "toPlay",
}) => {
  const socket = useGame()?.socket;
  const router = useRouter();
  const { map } = router.query;
  // if (!mapBg) mapBg = "black";
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameOverModal, setGameOverModal] = useState<boolean>(false);
  const [gameEndType, setGameEndType] = useState<string>("");
  const [winner, setWinner] = useState<string>("");
  const [player1, setPlayer1] = useState<any>(null);
  const [player2, setPlayer2] = useState<any>(null);
  const [playD3if] = useSound("/sounds/d3if.mp3");
  const [play9bi7] = useSound("/sounds/9bi7.mp3");

  useEffect(() => {
    socket?.off("setColor_B").on("setColor_B", (color, player) => {
      player === "first" ? (plyLcolor = color) : (plyRcolor = color);
    });
    socket?.off("moveBall_B").on("moveBall_B", (next_x, next_y) => {
      moveBall(next_x, next_y);
    });

    canvasWidth = frontWidth * 0.8;
    canvasHeight = canvasWidth * 0.45;
    coefficent = canvasWidth / data?.width;

    socket?.off("mouseMove_B").on("mouseMove_B", (newPos, player) => {
      if (player === "first") setData((prev: any) => ({ ...prev, player1_y: newPos }));
      else setData((prev: any) => ({ ...prev, player2_y: newPos }));
      if (data.player1_y === canvasHeight - data.paddleHeight)
        setData((prev: any) => ({ ...prev, player1_y: canvasHeight - data.paddleHeight }));
    });

    return () => {
      socket?.off("setColor_B");
      socket?.off("moveBall_B");
      socket?.off("mouseMove_B");
    };
  }, [socket, data, user]);

  useEffect(() => {
    socket?.off("gameOver_B").on("gameOver_B", (player1, player2) => {
      setGameOver(true);
      setGameOverModal(true);
      setPlayer1(player1);
      setPlayer2(player2);

      let winner = player1.score > player2.score ? "first" : "second";
      if (requestType != "toWatch") {
        if (winner === "first") {
          if (user.username === player1.username) play9bi7();
          else playD3if();
        } else {
          if (user.username === player2.username) play9bi7();
          else playD3if();
        }
      }
    });

    return () => {
      socket?.off("gameOver_B");
    };
  }, [socket, gameOver, playD3if, play9bi7, user, player1, player2]);

  //  **************  P5  ***************
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.ellipseMode(p5.CENTER);
  };

  //  **************  P5  ***************
  const draw = (p5: p5Types) => {
    // p5.background(mapBg);
    p5.clear();
    p5.rect(
      data.player1_x * coefficent,
      data.player1_y * coefficent,
      data.paddleWidth * coefficent,
      data.paddleHeight * coefficent,
      10
    );
    p5.rect(
      data.player2_x * coefficent,
      data.player2_y * coefficent,
      data.paddleWidth * coefficent,
      data.paddleHeight * coefficent,
      10
    );
    p5.fill("fff");
    p5.line(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
    p5.strokeWeight(4 * coefficent);
    p5.fill("fff");
    p5.ellipse(
      data.ball_x * coefficent,
      data.ball_y * coefficent,
      data.ballRadius * coefficent,
      data.ballRadius * coefficent
    );
    p5.noStroke();
  };

  //  **************  P5  ***************
  const windowResized = (p5: p5Types) => {
    if (!frontWidth) return;
    canvasWidth = frontWidth * 0.8;
    canvasHeight = canvasWidth * 0.45;
    coefficent = canvasWidth / data?.width;
    p5.resizeCanvas(canvasWidth, canvasHeight);
  };

  //  **********  mouseMoved  ***********
  const mouseMoved = (p5: p5Types) => {
    if (requestType === "toWatch") return;

    const mouseY = p5.constrain(p5.mouseY, 0, canvasHeight - data.paddleHeight * coefficent);
    socket?.emit("mouseMove_F", mouseY / coefficent, user);
  };

  // **********  moveBall  ***********
  const moveBall = (next_x: any, next_y: any) => {
    setData((prev: any) => ({ ...prev, ball_x: next_x, ball_y: next_y }));
  };

  if (!data) router.push("/404");
  return (
    <Style>
      {gameOver && (
        <GameOver
          isOpen={gameOverModal}
          contentLabel={"Game Over"}
          player1={player1}
          player2={player2}
        />
      )}
      <Image
        className="map"
        src={_maps[parseInt(map as string)] || _maps[0]}
        alt="map"
        width={canvasWidth}
        height={canvasHeight}
      />
      <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} windowResized={windowResized} />
    </Style>
  );
};

export default Canvas;

const Style = styled.section`
  position: relative;
  width: fit-content;
  > .map {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
    z-index: -1;
  }
`;
