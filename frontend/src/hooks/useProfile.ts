import { useState, useEffect } from "react";
import axios from "axios";

interface ProfileData {
  id: string;
  username: string;
  friends: number;
  avatar: string;
  score: number;
  isFriend: boolean;
}

export const useProfile = (username: string) => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        await axios
          .get(`${process.env.USERS}/getUser?username=${username}`, { withCredentials: true })
          .then(({ data }) => {
            setData({
              id: data.id,
              username: data.login,
              friends: data.friends,
              avatar: data.avatarUrl,
              score: data.score,
              isFriend: data.isFriend,
            });
          });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [username]);

  return { data, loading, error };
};
