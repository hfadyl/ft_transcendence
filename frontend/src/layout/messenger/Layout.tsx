import { ReactElement, ReactNode } from "react";
import styled from "styled-components";

import Head from "@/layout/Head";
import Conversations from "@/layout/messenger/Conversations";
import { SocketProvider } from "@/src/context/socket";
import { ChatSocketProvider } from "@/src/context/chat";
import { AuthProvider } from "@/src/context/auth";
import { GameSocketProvider } from "@/src/context/gameSocket";

export type MessagesPageWithLayout = {
  getLayout: (page: ReactElement) => ReactNode;
};

export const MessagesLayout = (page: ReactElement) => {
  return (
    <AuthProvider>
      <ChatSocketProvider>
        <GameSocketProvider>
          <SocketProvider>
            <Head title={`Messenger | Ping Pong Champion`} />
            <Style>
              <div>
                <Conversations />
                <div>{page}</div>
              </div>
            </Style>
          </SocketProvider>
        </GameSocketProvider>
      </ChatSocketProvider>
    </AuthProvider>
  );
};

const Style = styled.main`
  background-color: var(--background-200);
  padding: 0 10px 10px;

  > div {
    background-color: var(--background-100);
    display: flex;
    height: 100%;
    border-radius: 14px;
    overflow: hidden;
    > div {
      flex: 1;
      display: flex;
      position: relative;
    }
    @media (max-width: 768px) {
      border-radius: 0;
    }
  }
  .conversation {
    border-right: 1px solid var(--border);
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 370px;
    width: 33.33%;
    min-width: 300px;

    @media (max-width: 768px) {
      width: 60px;
      min-width: 30px;
      padding: 0;
      border-right: none;
    }
  }
  .messages {
    overflow-x: hidden;
    overflow-y: auto;
    flex: 66.33%;
  }
  .informations {
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 320px;
    min-width: 270px;
    flex: 33.33%;
    @media (max-width: 992px) {
      position: absolute;
      background-color: var(--background-100);
      top: 0;
      right: 0;
      bottom: 0;
      width: 300px;
      box-shadow: -2px 0px 10px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
  }
  @media (max-width: 768px) {
    padding: 0;
  }
`;
