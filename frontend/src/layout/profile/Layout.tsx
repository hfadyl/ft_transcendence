import styled from "styled-components";
import { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";

import Head from "@/layout/Head";
import Sidebar from "@/src/layout/profile/Sidebar";
import { SocketProvider } from "@/src/context/socket";
import { ChatSocketProvider } from "@/src/context/chat";
import { AuthProvider } from "@/src/context/auth";
import { GameSocketProvider } from "@/src/context/gameSocket";

export type ProfilePageWithLayout = {
  getLayout: (page: ReactElement) => ReactNode;
};

export const ProfileLayout = (page: ReactElement, title?: string) => {
  const router = useRouter();
  const { profile } = router.query;

  return (
    <AuthProvider>
      <ChatSocketProvider>
        <GameSocketProvider>
          <SocketProvider>
            <Head title={`${profile} ${title} | Ping Pong Champion`} />
            <Style>
              <Sidebar username={profile as string} />
              <Content>{page}</Content>
            </Style>
          </SocketProvider>
        </GameSocketProvider>
      </ChatSocketProvider>
    </AuthProvider>
  );
};

const Style = styled.main`
  display: flex;
  flex-direction: row;
  background-color: var(--background-200);
`;
const Content = styled.section`
  flex: 1;
  background-color: var(--background-100);
  border-radius: 14px;
  margin: 10px;
  margin-top: 0;
  margin-left: 0;
  padding: 30px 50px;
  overflow-y: auto;
  overflow-x: hidden;
  @media (max-width: 878px) {
    padding: 30px 20px;
  }
  h1 {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    gap: 10px;
    svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;
