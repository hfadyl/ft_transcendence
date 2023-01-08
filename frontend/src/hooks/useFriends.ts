import { useState, useEffect } from "react";
import axios from "axios";

interface FriendsType {
  id: string;
  username: string;
  avatar: string;
}

export const useFriends = () => {
  const [friends, setFriends] = useState<FriendsType[]>([]);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`${process.env.USERS}/getFriends`, {
          withCredentials: true,
        })
        .then((res) => {
          setFriends(
            res.data.map((friend: any) => ({
              id: friend.id,
              username: friend.login,
              avatar: friend.avatarUrl,
            }))
          );
        });
    };
    getData();
  }, []);

  return friends;
};
