import { FC, useState, useEffect } from "react";
import styled from "styled-components";

import SearchBar from "@/components/SearchInput";
import Avatar from "@/components/Avatar";
import ParticipantsOptions from "@/components/dropdowns/ParticipantsOptions";
import { ParticipantType } from "@/layout/messenger/interfaces";
import { useAuth } from "@/src/context/auth";

interface Props {
  roomId: string;
  participants: ParticipantType[];
  isAdmin: boolean;
  isOwner: boolean;
}

const ChatRoomParticipants: FC<Props> = ({ participants, roomId, isAdmin, isOwner }) => {
  const [search, setSearch] = useState<string>("");
  const myId = useAuth()?.user?.id;

  if (participants?.length === 0) return <p>No users found</p>;
  return (
    <Style>
      <SearchBar setValue={setSearch} value={search} />
      {participants
        ?.filter((i) => i?.username?.toLowerCase().includes(search.toLowerCase()))
        ?.map((p, index) => (
          <div className="participants" key={index}>
            <div>
              <Avatar src={p.avatar} alt={p.username} size={35} username={p.username} />
              <h6>{p.username}</h6>
            </div>
            <div>
              {!p.isOwner && p.isAdmin && <span>admin</span>}
              {p.isOwner && <span>owner</span>}
              {p.id !== myId && (
                <ParticipantsOptions
                  roomId={roomId}
                  userId={p.id}
                  username={p.username}
                  isAdmin={isAdmin}
                  isOwner={isOwner}
                  isParticipantOwner={p.isOwner}
                  isParticipantAdmin={p.isAdmin}
                  isMutted={p.isMutted}
                  isBanned={p.isBanned}
                />
              )}
            </div>
          </div>
        ))}
    </Style>
  );
};
export default ChatRoomParticipants;

const Style = styled.div`
  .participants {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    > div {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    span {
      color: var(--text-200);
      font-size: 14px;
      font-weight: 300;
    }
    .icon {
      opacity: 0;
      transition: opacity 0.3s ease;
      &:focus {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
    &:hover {
      .icon {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }
`;
