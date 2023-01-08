import { useState, useRef } from "react";
import styled from "styled-components";
import PlusIcon from "@/images/icons/plus.svg";
import { Chat, Game, TwoUsers } from "react-iconly";
import Tippy from "@tippyjs/react";

import Modal from "react-modal";
Modal.setAppElement("#__next");

import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import PlayGameModal from "@/components/modals/PlayGame";
import InvitePlayerModal from "@/components/modals/InvitePlayer";
import ChatRoomModal from "@/components/modals/CreateChatRoom";

const CallToAction = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [roomModal, setRoomModal] = useState<boolean>(false);
  const [playModal, setPlayModal] = useState<boolean>(false);
  const [inviteModal, setInviteModal] = useState<boolean>(false);

  useOnClickOutside(divRef, () => setToggle(false));

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };
  const handleCreateRoom = () => {
    setRoomModal(true);
  };
  const handlePlay = () => {
    setPlayModal(true);
  };
  const handleInvite = () => {
    setInviteModal(true);
  };
  return (
    <Style toggle={toggle} ref={divRef}>
      <Tippy content="Creat room" placement="top">
        <button className="room" onClick={handleCreateRoom}>
          <Chat set="bulk" />
        </button>
      </Tippy>
      <Tippy content="Play a game" placement="right">
        <button className="play" onClick={handlePlay}>
          <Game set="bulk" />
        </button>
      </Tippy>
      <Tippy content="Invite player" placement="right">
        <button className="invite" onClick={handleInvite}>
          <TwoUsers set="bulk" />
        </button>
      </Tippy>
      <button className="main" onClick={handleToggle}>
        <PlusIcon />
      </button>
      <ChatRoomModal isOpen={roomModal} setIsOpen={setRoomModal} contentLabel="Create chat room" />
      <PlayGameModal isOpen={playModal} setIsOpen={setPlayModal} contentLabel="Choose a map" />
      <InvitePlayerModal
        isOpen={inviteModal}
        setIsOpen={setInviteModal}
        contentLabel="Invite your friend"
      />
    </Style>
  );
};

export default CallToAction;

const Style = styled.div<{ toggle: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 3;
  button {
    padding: 0;
    border-radius: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-color: transparent;
    transition: bottom 0.2s ease-in, left 0.2s ease-in, transform 0.2s ease-in;
  }
  .main {
    width: 60px;
    height: 60px;
    transform: rotate(${({ toggle }) => (toggle ? "45" : "0")}deg);
  }
  .play,
  .room,
  .invite {
    position: absolute;
    bottom: 7px;
    left: 7px;
    background-color: #2d3263;
  }
  .room {
    ${({ toggle }) =>
      toggle &&
      `
        bottom: 90px;
    `}
  }
  .play {
    ${({ toggle }) =>
      toggle &&
      `
        bottom: 68px;
        left: 75px;
    `}
  }
  .invite {
    ${({ toggle }) =>
      toggle &&
      `
        bottom: 0;
        left: 90px;
    `}
  }
`;
