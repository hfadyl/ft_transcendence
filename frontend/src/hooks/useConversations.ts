import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ConversationProps } from "@/layout/messenger/interfaces";
import { useChat } from "@/src/context/chat";
import { useRouter } from "next/router";

export const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationProps[]>([]);
  const { message, setMessage } = useChat();
  const { id } = useRouter()?.query;

  const setToRead = () => {
    const index = conversations.findIndex((c) => c.id === id);
    if (index !== -1) {
      const newConversations = [...conversations];
      newConversations[index].unreadMessages = false;
      setConversations(newConversations);
    }
  };

  useEffect(() => {
    return () => {
      setToRead();
    };
  }, [id]);

  const getRooms = useCallback(async () => {
    await axios
      .get(`${process.env.CHAT}/getMyRooms`, { withCredentials: true })
      .then(({ data }) => {
        setConversations(data);
      });
  }, []);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  useEffect(() => {
    if (message) {
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === message.roomId);
        if (index !== -1) {
          const newConversations = [...prev];
          newConversations[index].lastMessage = message.message;
          newConversations[index].lastMessageTime = message.time;
          newConversations[index].unreadMessages = true;
          return newConversations;
        }
        return prev;
      });
    }
    return () => {
      setMessage(null);
    };
  }, [message, setMessage]);

  return conversations;
};
