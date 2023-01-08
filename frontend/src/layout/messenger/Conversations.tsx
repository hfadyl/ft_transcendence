import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
// import { Plus } from "react-iconly";
// import Tippy from "@tippyjs/react";
import Modal from "react-modal";
import moment from "moment";

import { ConversationProps } from "@/layout/messenger/interfaces";
import Avatar from "@/components/Avatar";
import SearchBar from "@/components/SearchInput";
// import ChatRoomModal from "@/components/modals/CreateChatRoom";
import { useConversations } from "@/hooks/useConversations";

Modal.setAppElement("#__next");

const Conversations = () => {
  const conversations = useConversations();
  const [search, setSearch] = useState<string>("");
  // const [modal, setModal] = useState<boolean>(false);
  const { id } = useRouter().query;

  if (conversations?.length === 0) return <></>;
  return (
    <Style className="conversation">
      <header>
        <h5>Chats</h5>
        {/* <Tippy content="Creat room" placement="bottom">
          <button className="icon md" onClick={() => setModal(true)}>
            <Plus set="bulk" />
          </button>
        </Tippy>
        <ChatRoomModal isOpen={modal} setIsOpen={setModal} contentLabel="Create chat room" /> */}
      </header>
      <SearchBar setValue={setSearch} value={search} />
      <div>
        {conversations
          ?.filter((i: ConversationProps) => i?.name?.toLowerCase().includes(search?.toLowerCase()))
          ?.sort((a: ConversationProps, b: ConversationProps) => {
            if (a?.lastMessageTime > b?.lastMessageTime) return -1;
            if (a?.lastMessageTime < b?.lastMessageTime) return 1;
            return 0;
          })
          ?.map((conversation: ConversationProps, index: number) => (
            <div key={index}>
              <Conversation
                href={`/messages/${conversation?.id}`}
                className={id === conversation?.id ? "active" : ""}
              >
                <Avatar
                  src={conversation?.avatar}
                  size={40}
                  alt={conversation?.name}
                  username={conversation?.name}
                  link={false}
                />
                <div className="content">
                  <header>
                    <h6>{conversation?.name}</h6>
                    <b className="time">{moment(conversation?.lastMessageTime).fromNow()}</b>
                  </header>
                  <p
                    className={`${
                      conversation?.unreadMessages && conversation?.id !== id ? "unread" : ""
                    }`}
                  >
                    {conversation?.lastMessage || "No messages yet"}
                  </p>
                </div>
                {conversation?.unreadMessages && conversation?.id !== id && (
                  <span className="unread"></span>
                )}
              </Conversation>
            </div>
          ))}
      </div>
    </Style>
  );
};
export default Conversations;

const Style = styled.aside`
  padding: 30px 10px 0;
  > header {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  input[type="radio"] {
    pointer-events: none;
    user-select: none;
    position: absolute;
    opacity: 0;
    :focus + label {
      background-color: #342e59;
    }
  }

  @media (max-width: 768px) {
    > header {
      margin-bottom: 0;
      justify-content: center;
      padding: 10px 0;
    }
    .search,
    h5 {
      display: none;
    }
  }
`;
const Conversation = styled(Link)`
  display: flex;
  padding: 10px 10px;
  gap: 10px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  transition: background-color 0.2s ease-in-out;
  color: var(--text-100);

  :hover,
  &.active {
    transition: background-color 0.2s ease-in-out;
    background-color: #342e59;
  }

  span.unread {
    position: absolute;
    right: 10px;
    bottom: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary);
  }
  > div {
    flex: 1;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h6 {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; // number of lines to show
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  p {
    color: var(--text-200);
    font-size: 0.87rem;
    font-family: var(--font-regular);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; // number of lines to show
    -webkit-box-orient: vertical;
    line-height: 1.5;
    word-break: break-all;
    &.unread {
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    .content,
    span.unread {
      display: none;
    }
  }
`;
