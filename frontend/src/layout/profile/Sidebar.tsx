import { FC, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { User, Setting, InfoCircle, Paper, People, ShieldFail } from "react-iconly";
import PlayCard from "@/components/PlayCard";

import FeedbackModal from "@/components/modals/Feedback";
import Level from "@/components/Level";
import Avatar from "@/components/Avatar";
import AvatarUpload from "@/src/components/AvatarUpload";
import { useAuth } from "@/src/context/auth";
import { useSocket } from "@/src/context/socket";
import { getLevel } from "@/src/tools";
import { useProfile } from "@/hooks/useProfile";

const Sidebar: FC<{ username: string }> = ({ username }) => {
  const { data, error, loading } = useProfile(username);
  const [feedbackModal, setFeedbackModal] = useState<boolean>(false);
  const router = useRouter();
  const { user: me } = useAuth();
  const { getStatus } = useSocket();
  if (error) console.log(error);
  if (loading) return <div>Loading...</div>;

  return (
    <SidebarStyle>
      <header>
        <div className="image">
          {username === me?.username ? (
            <AvatarUpload src={data?.avatar} alt={username} size={140} />
          ) : (
            <Avatar src={data?.avatar} alt={username} size={140} link={false} />
          )}
          <span className={"status " + getStatus(username)}>
            {getStatus(username) === "inGame" ? "In game" : getStatus(username)}
          </span>
        </div>
        <h4>{username}</h4>
        <div className="level">
          <Level score={data?.score} size={"sm"} />
          {getLevel(data?.score || 0)}
        </div>
      </header>
      <nav>
        <Link
          href={`/${username}`}
          className={
            router.pathname.split("/")[1] === "[profile]" &&
            router.pathname.split("/")[2] === undefined
              ? "active"
              : ""
          }
        >
          <span></span>
          <User set="bulk" />
          <b>Profile</b>
        </Link>
        <Link
          href={`/${username}/matchHistory`}
          className={router.pathname.split("/")[2] === "matchHistory" ? "active" : ""}
        >
          <span></span>
          <Paper set="bulk" />
          <b>Match history</b>
        </Link>
        <Link
          href={`/${username}/friends`}
          className={router.pathname.split("/")[2] === "friends" ? "active" : ""}
        >
          <span></span>
          <People set="bulk" />
          <b>Friends</b>
          <b>({data?.friends})</b>
        </Link>
        {username === me?.username && (
          <Link
            href={`/${username}/blockList`}
            className={router.pathname.split("/")[2] === "blockList" ? "active" : ""}
          >
            <span></span>
            <ShieldFail set="bulk" />
            <b>block List</b>
          </Link>
        )}
        <div className="divider"></div>
        <PlayCard />
        {username === me?.username && (
          <Link
            href={`/${username}/settings`}
            className={router.pathname.split("/")[2] === "settings" ? "active" : ""}
          >
            <span></span>
            <Setting set="bulk" />
            <b>Settings</b>
          </Link>
        )}
        <button className="none" onClick={() => setFeedbackModal(true)}>
          <span></span>
          <InfoCircle set="bulk" />
          <b>send feedback</b>
        </button>
      </nav>
      <FeedbackModal
        isOpen={feedbackModal}
        setIsOpen={setFeedbackModal}
        contentLabel="Send us a feedback"
      />
    </SidebarStyle>
  );
};
export default Sidebar;

const SidebarStyle = styled.aside`
  width: 300px;
  background-color: var(--background-200);
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  @media (max-width: 992px) {
    width: 60px;
  }
  header {
    padding-left: 24px;
    padding-right: 24px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 992px) {
      padding-right: 0;
      padding-left: 0;
    }
    .image {
      border-radius: 100px;
      height: 140px;
      position: relative;
      @media (min-width: 992px) {
        :hover span {
          width: auto;
          transition: width 0.2s ease-in;
        }
      }
      .status {
        position: absolute;
        bottom: 15px;
        left: 80%;
        font-weight: 400;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0px 6px;
        border-radius: 30px;
        text-transform: capitalize;
        width: 24px;
        overflow: hidden;
        transition: width 0.2s ease-in;
        white-space: nowrap;
        border: 1px solid transparent;
        ::before {
          content: "";
          width: 10px;
          min-width: 10px;
          height: 10px;
          border-radius: 10px;
        }
        &.online {
          color: #43ff83;
          background-color: rgba(67, 255, 131, 0.2);
          &::before {
            background-color: #43ff83;
          }
        }
        &.offline {
          color: var(--text-200);
          background-color: #272042be;
          border-color: var(--text-200);
          &::before {
            background-color: var(--text-200);
          }
        }
        &.inGame {
          color: #e17a00;
          background-color: rgba(225, 122, 0, 0.15);
          &::before {
            background-color: #e17a00;
          }
        }
      }
    }
    h4 {
      margin-top: 10px;
      margin-bottom: 5px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      width: 250px;
    }
    .level {
      color: var(--text-200);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    @media (max-width: 992px) {
      .image {
        height: 40px !important;
        .avatar {
          width: 40px !important;
          min-width: 40px !important;
          height: 40px !important;
          min-height: 40px !important;
        }
        > span {
          bottom: 0 !important;
          left: 65% !important;
        }
      }
      h4,
      span,
      .level {
        display: none;
      }
    }
  }
  nav {
    display: flex;
    flex-direction: column;
    flex: 1;
    .divider {
      height: 0;
      margin-top: auto;
    }
    a,
    > button {
      display: block;
      width: 100%;
      padding: 10px;
      padding-left: 30px;
      color: var(--text-300);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      position: relative;
      white-space: nowrap;
      font-weight: 400;
      font-family: var(--font-regular);
      svg {
        min-width: 24px;
        min-height: 24px;
      }

      span {
        margin: 0;
        width: 5px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
      }
      &.active {
        background-color: var(--background-100);
      }
      :hover {
        color: var(--primary);
      }
      :focus {
        box-shadow: none;
        color: var(--primary);
      }
      &.active {
        color: var(--primary);
        span {
          background-color: var(--primary);
        }
        :focus {
          color: var(--text-100);
        }
        ::after,
        ::before {
          content: "";
          position: absolute;
          right: 0;
          width: 30px;
          height: 30px;
          background-color: var(--background-200);
          z-index: 1;
        }
        ::after {
          background-color: var(--background-200);
          box-shadow: 0 17px 0 var(--background-100);
          bottom: 100%;
          border-bottom-right-radius: 14px;
        }
        ::before {
          top: 100%;
          background-color: var(--background-200);
          box-shadow: 0 -17px 0 var(--background-100);
          border-top-right-radius: 14px;
        }
      }
      @media (max-width: 992px) {
        padding-left: 10px;
        justify-content: center;
        b {
          display: none;
        }
        &.active::after,
        &.active::before {
          width: 10px;
          height: 10px;
        }
        &.active::after {
          border-bottom-right-radius: 14px;
          box-shadow: 0 6px 0 var(--background-100);
        }
        &.active::before {
          box-shadow: 0 -6px 0 var(--background-100);
          border-top-right-radius: 14px;
        }
      }
    }
  }
`;
