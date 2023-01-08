import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { MessagesLayout, MessagesPageWithLayout } from "@/layout/messenger/Layout";
import axios from "axios";

type MessagePageProps = MessagesPageWithLayout & NextPage;

const Messenger: MessagePageProps = () => {
  const router = useRouter();

  useEffect(() => {
    const getLastActiveRoom = async () => {
      try {
        await axios
          .get(`${process.env.CHAT}/getLastActiveRoom`, {
            withCredentials: true,
          })
          .then(({ data }) => {
            if (data) router.push(`/messages/${data}`);
            else {
              toast.info("You have no active rooms");
              setTimeout(() => {
                router.push("/");
              }, 1000);
            }
          })
          .catch(() => {});
      } catch (err) {}
    };
    getLastActiveRoom();
  }, [router]);
  return null;
};
export default Messenger;

Messenger.getLayout = (page) => MessagesLayout(page);
