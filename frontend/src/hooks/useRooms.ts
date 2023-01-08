import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Router from "next/router";

export interface RoomParticipantsType {
  id: string;
  username: string;
  avatar: string;
}
export interface RoomType {
  id: string;
  name: string;
  state: "public" | "protected" | "private";
  participants: RoomParticipantsType[];
  isJoined: boolean;
}

export const useRooms = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [passwordError, setPasswordError] = useState<string>("");
  const [createError, setCreateError] = useState<string>("");

  const getRooms = async () => {
    try {
      const res = await fetch(`${process.env.CHAT}/getRooms`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data) setRooms(data);
    } catch (err) {}
  };

  useEffect(() => {
    getRooms();
  }, []);

  const handleJoin = useCallback(async (e: any, id: string, password: string) => {
    e.preventDefault();
    setPasswordError("");

    await axios
      .post(`${process.env.CHAT}/joinRoom`, { roomId: id, password }, { withCredentials: true })
      .then(({ data }) => {
        if (data?.statusCode) setPasswordError(data?.message);
        else Router.push(`/messages/${id}`);
      })
      .catch((err) => setPasswordError(err?.response?.data?.message));
  }, []);

  const createRoom = useCallback(
    async (
      name: string,
      state: "public" | "private" | "protected",
      password: string | null,
      participants: string[]
    ) => {
      await axios
        .post(
          `${process.env.CHAT}/createRoom`,
          { name, state, password, participants },
          { withCredentials: true }
        )
        .then(({ data }) => {
          if (data?.statusCode) setCreateError(data?.message);
          else {
            setCreateError("");
            toast.success("Room created successfully");
          }
        })
        .catch((err) => setCreateError(err?.response?.data?.message));
    },
    []
  );

  return { rooms, handleJoin, passwordError, createRoom, createError };
};
