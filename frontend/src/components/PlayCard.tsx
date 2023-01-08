import { useState } from "react";
import styled from "styled-components";
import { Game } from "react-iconly";
import PlayGameModal from "@/components/modals/PlayGame";
import PlayCardImg from "@/images/illustrations/desktop.svg";
import Background from "@/images/backgrounds/gradient.jpg";

const PlayCard = () => {
  const [playModal, setPlayModal] = useState<boolean>(false);

  return (
    <PlayCardStyle>
      <div>
        <h5>Join a game</h5>
        <PlayCardImg />
        <h6>Let the fun begin</h6>
        <button onClick={() => setPlayModal(true)}>Play Now</button>
      </div>
      <button className="icon primary" onClick={() => setPlayModal(true)}>
        <Game set="bulk" />
      </button>
      <PlayGameModal isOpen={playModal} setIsOpen={setPlayModal} contentLabel="Choose a map" />
    </PlayCardStyle>
  );
};
export default PlayCard;

const PlayCardStyle = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  > div {
    background: url(${Background.src}) no-repeat center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 24px 20px;
    margin-inline: 24px;
    border: 1px solid var(--border);
    filter: drop-shadow(3px 3px 20px rgba(34, 13, 95, 0.25));
    border-radius: 14px;
    overflow: hidden;
    ::after {
      content: "";
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 14px;
      z-index: -1;
    }
    button {
      width: 100%;
      background: none;
      border-color: var(--text-100);
      :hover {
        background-color: var(--text-100);
        color: var(--background-200);
      }
    }
    svg {
      margin-top: 15px;
      margin-bottom: 24px;
    }
  }
  h6 {
    margin-bottom: 14px;
  }
  .icon {
    display: none;
  }
  @media (max-width: 992px) {
    text-align: center;
    margin-bottom: 24px;
    > div {
      display: none;
    }
    .icon {
      display: inline-flex;
      width: 40px;
      height: 40px;
      svg {
        width: 20px;
      }
    }
  }
`;
