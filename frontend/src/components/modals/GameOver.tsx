import { FC, useMemo } from "react";
import styled from "styled-components";
import { Game, Home } from "react-iconly";
import Link from "next/link";
import { useRouter } from "next/router";

import Modal from "@/src/layout/Modal";
import WinnerBadge from "@/images/illustrations/winner.svg";
import Avatar from "@/components/Avatar";

interface Props {
  isOpen: boolean;
  contentLabel: string;
  player1: any;
  player2: any;
}

export const GameOver: FC<Props> = (props) => {
  const { isOpen, player1, player2 } = props;
  const router = useRouter();
  const { requestType } = router.query;

  const winner = useMemo(() => {
    return player1?.score > player2?.score ? "player1" : "player2";
  }, [player1, player2]);

  return (
    <Modal isOpen={isOpen}>
      <Style>
        <h1>Game Over</h1>
        <div className="players">
          <Player>
            <Avatar
              src={player1?.avatar}
              alt={player1?.username}
              size={100}
              username={player1?.username}
            />
            {"player1" === winner && <WinnerBadge className="badge" />}
            <p>{player1?.username}</p>
          </Player>
          <div className="score">
            <h3>{player1?.score}</h3>
            <span>-</span>
            <h3>{player2?.score}</h3>
          </div>
          <Player>
            <Avatar
              src={player2?.avatar}
              alt={player2?.username}
              size={100}
              username={player2?.username}
            />
            {"player2" === winner && <WinnerBadge className="badge" />}
            <p>{player2?.username}</p>
          </Player>
        </div>
        <div className="actions">
          <Link href="/" className="btn secondary">
            <Home set="bulk" />
            <span>Home</span>
          </Link>
          {requestType !== "toWatch" && (
            <Link href="/game" className="btn">
              <Game set="bulk" />
              <span>Play again</span>
            </Link>
          )}
        </div>
      </Style>
    </Modal>
  );
};

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    margin-bottom: 24px;
    animation: glitchtext 400ms linear infinite;
    text-shadow: 3px 0 0 rgba(255, 0, 255, 1), -3px 0 0 rgba(0, 255, 255, 1);
    font-size: 4rem;
    font-family: var(--font-bold);
  }
  .players {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .score {
    display: flex;
    align-items: center;
    span:nth-child(2) {
      margin: 0 10px;
      font-size: 30px;
    }
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 50px;
    margin-bottom: 20px;
  }

  @keyframes glitchtext {
    0% {
      text-shadow: 3px 0 0 rgba(255, 0, 255, 1), -3px 0 0 rgba(0, 255, 255, 1);
    }
    20% {
      text-shadow: 0 0 0 rgba(255, 0, 255, 1), -3px -1px 0 rgba(0, 255, 255, 1);
    }
    40% {
      text-shadow: -3px -2px 0 rgba(255, 0, 255, 1), 2px 1px 0 rgba(0, 255, 255, 1);
    }
    60% {
      text-shadow: -1px 2px 0 rgba(255, 0, 255, 1), 0 0 0 rgba(0, 255, 255, 1);
    }
    80% {
      text-shadow: 2px -1px 0 rgba(255, 0, 255, 1), 3px 2px 0 rgba(0, 255, 255, 1);
    }
    100% {
      text-shadow: 3px 0 0 rgba(255, 0, 255, 1), -3px 0 0 rgba(0, 255, 255, 1);
    }
  }
`;

const Player = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .badge {
    position: absolute;
    top: 60px;
    right: -15px;
  }

  p {
    margin-top: 24px;
    font-weight: 600;
  }
`;
