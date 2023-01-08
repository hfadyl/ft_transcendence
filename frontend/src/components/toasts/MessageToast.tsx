import styled from "styled-components";
import Link from "next/link";
import { MessagesType } from "@/src/layout/messenger/interfaces";
import Avatar from "@/components/Avatar";

const MessageToast: React.FC<MessagesType> = (props) => {
  const { roomId, username, avatar, isRoom, message } = props;

  return (
    <Style href={`/messages/${roomId}`}>
      <Avatar src={avatar} alt={username} size={40} username={username} link={false} />
      <div>
        {isRoom ? <span>{username} to a room</span> : <span>{username}</span>}
        <p>{message}</p>
      </div>
    </Style>
  );
};

export default MessageToast;

const Style = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-100);

  p {
    font-family: var(--font-regular);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; // number of lines to show
    -webkit-box-orient: vertical;
    line-height: 1.5;
    word-break: break-all;
  }
`;
