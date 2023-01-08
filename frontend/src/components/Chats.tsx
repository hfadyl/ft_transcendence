import { useState, useEffect, useRef, FC } from "react";
import styled from "styled-components";
import moment from "moment";
import { Send } from "react-iconly";
import { useRouter } from "next/router";

import Avatar from "@/components/Avatar";
import { MessagesType } from "@/layout/messenger/interfaces";
import { useChat } from "@/src/context/chat";
import { useAuth } from "@/src/context/auth";

interface Props {
  content: MessagesType[];
  isBlocked: boolean;
}

const Chats: FC<Props> = ({ content, isBlocked }) => {
  const [messages, setMessages] = useState<MessagesType[]>(content);
  const [text, setText] = useState<string>("");
  const { socket, message, setMessage } = useChat();
  const chatRef = useRef<HTMLDivElement>(null);
  const { user: me } = useAuth();
  const { id: roomId } = useRouter().query;

  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [message, messages]);

  useEffect(() => {
    setMessages(content);
    return () => {
      setText("");
    };
  }, [content]);

  useEffect(() => {
    if (message && roomId === message.roomId) {
      const index = content.findIndex((m) => m.id === message.id);
      if (index === -1) {
        setMessages((prev) => [...prev, message]);
        setMessage(null);
      }
    }
  }, [message, roomId, setMessage, content]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === "" || !me || !socket || isBlocked) return;
    socket.emit("chatToServer", { roomId, message: text, date: new Date() });
    setText("");
  };

  return (
    <>
      <Style>
        {messages?.length === 0 && (
          <h4 className="no-messages">No messages yet</h4>
        )}
        {messages?.map((m, index) =>
          m.username !== me?.username ? (
            <MessageStyle key={index}>
              <div className="header">
                <Avatar
                  src={m.avatar}
                  alt={m.username}
                  size={35}
                  username={m.username}
                />
                {<h6>{m.username}</h6>}
                <b className="time">{moment(m.time).calendar()}</b>
              </div>
              <div className="message">
                <p>{m.message}</p>
              </div>
            </MessageStyle>
          ) : (
            <MyMessage key={index}>
              <b className="time">{moment(m.time).calendar()}</b>
              <div className="message">
                <p>{m.message}</p>
              </div>
            </MyMessage>
          )
        )}
        <div ref={chatRef} />
      </Style>
      <form onSubmit={handleSend} className={`${isBlocked ? "isBlocked" : ""}`}>
        <input
          type="text"
          placeholder={
            isBlocked ? "You can't send a message" : "Send a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {!isBlocked && (
          <button type="submit">
            <Send set="bulk" size={20} />
          </button>
        )}
      </form>
    </>
  );
};
export default Chats;

const Style = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  padding-top: 120px;
  border-radius: 15px 15px 0px 0px;
  background-color: var(--background-200);
  > div {
    :not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .no-messages {
    text-align: center;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-300);
  }
  .message {
    max-width: 450px;
    padding: 10px;
    word-break: break-all;
  }
`;
const MyMessage = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px !important;
  .message {
    background-color: var(--primary);
    border-radius: 15px 0px 15px 15px;
  }
`;
const MessageStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .message {
    margin-top: 10px;
    border-radius: 0px 15px 15px 15px;
    background-color: var(--background-100);
  }
  .header {
    display: flex;
    align-items: center;
    h6 {
      margin-right: 15px;
      margin-left: 10px;
    }
  }
`;
