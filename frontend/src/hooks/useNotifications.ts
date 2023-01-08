import { useEffect } from "react";
import axios from "axios";
import { useSocket } from "@/src/context/socket";

export const useNotifications = () => {
  const { notifications, updateNotifications, setNotifications } = useSocket();

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`${process.env.USERS}/getNotifications`, { withCredentials: true })
        .then((res) => {
          setNotifications(res.data);
        });
    };
    getData();
  }, [setNotifications]);

  return { notifications, updateNotifications };
};
