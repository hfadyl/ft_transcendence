import styled from "styled-components";
import Avatar from "@/components/Avatar";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { useFriends } from "@/hooks/useFriends";

interface FriendsProp {
  id: string;
  username: string;
  avatar: string;
}

const Friends = () => {
  const friends = useFriends();
  return (
    <Style>
      {friends?.map((friend: FriendsProp, index: number) => (
        <Tippy key={index} content={friend.username} placement="left">
          <div>
            <Link href={`/${friend.username}`}>
                <Avatar
                  src={friend.avatar}
                  alt={friend.username}
                  size={40}
                  username={friend.username}
                  link={false}
                />
            </Link>
          </div>
        </Tippy>
      ))}
    </Style>
  );
};
export default Friends;

const Style = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9;
  overflow: auto;
  background-color: #2c254aca;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  backdrop-filter: blur(3px);
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;

  height: 60px;
  transition: height 0.3s ease-in-out;

  :hover {
    height: 100%;
    transition: height 0.5s ease-in-out;
  }
`;
