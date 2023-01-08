import { ReactElement, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import NProgress from "nprogress";
import Router from "next/router";
import { NextPage } from "next";

import Navbar from "@/layout/Navbar";
import { AuthProvider } from "@/src/context/auth";
import { SocketProvider } from "@/src/context/socket";
import { GameSocketProvider } from "@/src/context/gameSocket";
import { ChatSocketProvider } from "@/src/context/chat";

import "nprogress/nprogress.css";
import "tippy.js/dist/tippy.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/effect-cards";
import "../sass/style.sass";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  noLayout?: boolean;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.noLayout === true) return <Component {...pageProps} />;
  if (Component.getLayout)
    return Component.getLayout(
      <>
        <ToastContainer pauseOnHover closeOnClick theme="colored" style={{ top: "64px" }} pauseOnFocusLoss />
        <Navbar />
        <Component {...pageProps} />
      </>
    );
  return (
    <AuthProvider>
      <ChatSocketProvider>
        <GameSocketProvider>
          <SocketProvider>
            <ToastContainer pauseOnHover closeOnClick theme="colored" style={{ top: "64px" }} pauseOnFocusLoss />
            <Navbar />
            <Component {...pageProps} />
          </SocketProvider>
        </GameSocketProvider>
      </ChatSocketProvider>
    </AuthProvider>
  );
}
