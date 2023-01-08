import styled from "styled-components";

import Head from "@/layout/Head";
import Brand from "@/images/brand/brand-lg.svg";
import _42_Logo from "@/images/brand/42.svg";
import Atropos from "atropos/react";
import Link from "next/link";
import Image from "next/image";

import BG from "@/images/backgrounds/bg.svg";
import Front from "@/images/backgrounds/forest-front.svg";
import Back from "@/images/backgrounds/forest-back.svg";
import Middle from "@/images/backgrounds/forest-mid.svg";
import Moutains from "@/images/backgrounds/moutains.svg";

import "atropos/css";

export type PageWithNoLayout = {
  noLayout: boolean;
};
const Login: PageWithNoLayout = () => {
  return (
    <>
      <Head title="Login | Ping Pong Champion" />
      <Style>
        <div className="content">
          <Atropos className="atropos-banner" highlight={false}>
            <img className="atropos-banner-spacer" src="/images/backgrounds/bg.svg" alt="" />
            <img data-atropos-offset="-4.5" src="/images/backgrounds/bg.svg" alt="" />
            <img data-atropos-offset="-2.5" src="/images/backgrounds/mountains.svg" alt="" />
            <img data-atropos-offset="0" src="/images/backgrounds/forest-back.svg" alt="" />
            <img data-atropos-offset="2" src="/images/backgrounds/forest-mid.svg" alt="" />
            <img data-atropos-offset="4" src="/images/backgrounds/forest-front.svg" alt="" />
            <img
              className="atropos-logo"
              data-atropos-offset="5"
              src="/images/brand/brand-lg.svg"
              alt=""
            />
            <div className="form">
              <Link href={`${process.env.AUTH}/login`} className="btn lg">
                <_42_Logo />
                <span>Login with Intranet</span>
              </Link>
            </div>
          </Atropos>
        </div>
      </Style>
    </>
  );
};
export default Login;

Login.noLayout = true;

const Style = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #b53df5, #5814a2);
  height: 100vh;
  position: relative;
  bottom: 62.4px;

  .content {
    .btn {
      font-weight: 700;
      background-color: #b53ef4;
      border-color: #b53ef4;
      padding: 12px 24px;
      border-radius: 50px;
      position: relative;
      top: 50px;
    }

    @media (max-width: 768px) {
      width: 90%;
      padding: 40px 10px;
    }
  }
  .form {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .content {
    padding: 0px 40px;
    max-width: 960px;
    margin: 32px auto;
    display: flex;
    width: 100%;
    box-sizing: border-box;
  }
  .atropos-banner {
    width: 100%;
  }
  .atropos-banner .atropos-inner {
    border-radius: 10px;
  }
  .atropos-banner img {
    max-width: initial;
    position: absolute;
    left: -5%;
    top: -5%;
    width: 110%;
    height: 110%;
    object-fit: contain;
    display: block;
    z-index: 1;
    transform-style: preserve-3d;
    pointer-events: none;
  }
  .atropos-banner img.atropos-banner-spacer {
    position: relative;
    width: 100%;
    height: auto;
    left: 0;
    top: 0;
    visibility: hidden;
  }
  .atropos-banner img.atropos-logo {
    width: 50%;
    height: 50%;
    top: 0px;
    left: 25%;
  }
  .atropos-banner .atropos-shadow {
    filter: blur(50px);
    opacity: 0.5;
  }
  .atropos-banner .atropos-highlight {
    z-index: 100;
  }

  .atropos-banner-text {
    position: absolute;
    color: #fff;
    font-weight: bold;
    left: 0%;
    top: 0%;
  }
`;
