import { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Message } from "react-iconly";
import { useRouter } from "next/router";
import Tippy from "@tippyjs/react";

import Logo from "@/images/brand/brand.svg";
import Diamond from "@/images/icons/diamond.svg";
import Search from "@/components/NavbarSearch";
import Level from "@/components/Level";
import { getLevel } from "@/src/tools";
import ProfileDropdown from "@/components/dropdowns/Profile";
import Notifications from "@/components/dropdowns/Notifications";
import { useAuth } from "@/src/context/auth";

const Navbar: FC = () => {
  const router = useRouter();
  const user = useAuth()?.user;

  if (router.pathname.startsWith("/login") || router.pathname == "/404") return null;
  return (
    <Style>
      <Link href="/" className="logo" title="Ping Pong Champion">
        <Logo />
      </Link>
      <Search />
      <div className="right">
        <Tippy
          content={
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Level score={user?.score || 0} size="sm" />
              <span>{getLevel(user?.score || 0)}</span>
            </div>
          }
          placement="bottom"
        >
          <div className="score">
            <Diamond />
            <span>{user?.score}</span>
          </div>
        </Tippy>
        <Link href={`/messages`} className={`btn icon md`}>
          <Message set="bulk" size={20} />
        </Link>
        <Notifications />
        <ProfileDropdown />
      </div>
    </Style>
  );
};
export default Navbar;

const Style = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-200);
  padding: 10px 24px;
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  .search {
    flex: 1;
    max-width: 500px;
    margin: 0 10px;
  }

  .logo {
    &:focus {
      box-shadow: none;
    }
  }

  .score {
    display: inline-flex;
    align-items: center;
    margin-right: 12px;
    padding: 4px 10px;
    border-radius: 10px;

    :hover {
      background-color: #342e59;
    }

    span {
      margin-left: 5px;
      font-family: var(--font-medium);
    }
    @media (max-width: 768px) {
      display: none;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;
