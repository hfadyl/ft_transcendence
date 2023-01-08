import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import styled from "styled-components";
import axios from "axios";
import { InfoCircle, Password, Lock, Game } from "react-iconly";

import Tippy from "@tippyjs/react";
import { MessagesLayout, MessagesPageWithLayout } from "@/layout/messenger/Layout";
import Chats from "@/components/Chats";
import Avatar from "@/components/Avatar";
import UserOptions from "@/components/dropdowns/UserOptions";
import Informations from "@/layout/messenger/Informations";
import { DataType } from "@/layout/messenger/interfaces";
import { useSocket } from "@/src/context/socket";
import { useAuth } from "@/src/context/auth";
import { useInvitePlayer } from "@/src/hooks/useInvitePlayer";

const Messages: MessagesPageWithLayout = ({ data }: { data: DataType }) => {
  const { id, name, avatar, participants, messages, userId, isBlocked } = data;
  const [state, setState] = useState<"private" | "protected" | "public" | null>(data.state);
  const [toggleInfo, setToggleInfo] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const { getStatus } = useSocket();
  const { user } = useAuth();
  const { handleInvite } = useInvitePlayer();
  const [_isBlocked, setIsBlocked] = useState<boolean>(isBlocked);

  useEffect(() => {
    if (window !== undefined) setToggleInfo(window.localStorage.getItem("toggleInfo") === "true");
  }, []);

  useEffect(() => {
    if (user === null) return;
    participants?.forEach((u) => {
      if (u.id === user.id && (u.isBanned || u.isMutted)) setIsBanned(true);
    });
    return () => setIsBanned(false);
  }, [user, participants]);

  const handleInfo = () => {
    localStorage.setItem("toggleInfo", toggleInfo ? "false" : "true");
    setToggleInfo((prev) => !prev);
  };

  return (
    <>
      <Style className="messages">
        <div>
          <HeaderStyle>
            <Avatar src={avatar || ""} size={60} alt={name} username={name} />
            <div>
              <div>
                <h5>{name}</h5>
                {!userId && <p>{participants?.length} participants</p>}
                {userId && <span>{getStatus(name || "")}</span>}
              </div>
              {userId ? (
                <div className="user-options">
                  {getStatus(name) === "online" && !_isBlocked && (
                    <Tippy content="Invite to play" placement="bottom">
                      <button className="icon" onClick={() => handleInvite(name)}>
                        <Game set="bulk" />
                      </button>
                    </Tippy>
                  )}
                  <UserOptions id={userId} isBlocked={_isBlocked} setIsBlocked={setIsBlocked} />
                </div>
              ) : (
                <div className="group-state">
                  <Tippy content={state} placement="bottom">
                    <div>
                      {state === "protected" && <Password set="bulk" />}
                      {state === "private" && <Lock set="bulk" />}
                    </div>
                  </Tippy>
                  <Tippy content="Informations" placement="bottom">
                    <button className="icon" onClick={handleInfo}>
                      <InfoCircle set="bulk" />
                    </button>
                  </Tippy>
                </div>
              )}
            </div>
          </HeaderStyle>
          <Chats content={messages} isBlocked={_isBlocked || isBanned} />
        </div>
      </Style>
      {userId === null && (
        <Informations
          data={data}
          toggle={toggleInfo}
          setToggle={handleInfo}
          roomId={id}
          setState={setState}
          state={state}
        />
      )}
    </>
  );
};
export default Messages;

Messages.getLayout = (page) => MessagesLayout(page);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const { jwt } = context.req.cookies;
  let data: DataType[] = [];

  try {
    await axios
      .get(`${process.env.CHAT}/getRoom?id=${id}`, {
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        return {
          notFound: true,
        };
      });
  } catch (err) {
    return {
      notFound: true,
    };
  }
  if (data.length === 0) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data,
    },
  };
};

const Style = styled.div`
  padding: 0 10px 10px;
  > div {
    border-radius: 0px 0px 14px 14px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .isBlocked {
    text-align: center;
    padding-top: 10px;
  }
  form {
    padding: 10px;
    background-color: var(--background-200);
    position: relative;
    &.isBlocked {
      opacity: 0.45;
      pointer-events: none;
      cursor: not-allowed;
    }
    input {
      width: 100%;
      box-shadow: 2px 2px 9px 1px rgba(0, 0, 0, 0.13);
    }
    button {
      position: absolute;
      right: 16px;
      top: 14px;
      padding: 7px;
      box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.3);
    }
  }
  .user-options {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const HeaderStyle = styled.header`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  padding: 15px 24px;
  background: rgba(44, 37, 74, 0.9);
  backdrop-filter: blur(6px);
  width: 100%;
  min-height: 86px;
  display: flex;
  gap: 15px;
  z-index: 1;

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      color: var(--text-200);
    }
  }
  .group-state {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
