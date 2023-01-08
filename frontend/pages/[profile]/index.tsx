import Link from "next/link";
import { User, Message } from "react-iconly";
import { GetServerSideProps } from "next";
import type { NextPage } from "next";
import styled from "styled-components";
import { useAuth } from "@/src/context/auth";
import axios from "axios";

import { ProfileLayout, ProfilePageWithLayout } from "@/layout/profile/Layout";
import Level from "@/src/components/Level";
import AddUnfriend from "@/components/AddUnfriend";
import UserOptions from "@/components/dropdowns/UserOptions";
import { getLevel, getLevelProgress } from "@/src/tools";

import Losses from "@/images/icons/losses.svg";
import Wins from "@/images/icons/wins.svg";
import Diamond from "@/images/icons/diamond.svg";
import Achievements from "@/src/components/Achievements";

interface UserType {
  id: string;
  roomId?: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  fullName: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  twoFactor: boolean;
  wins: number;
  losses: number;
  score: number;
  isFriend: boolean;
  isPending: boolean;
  isRequested: boolean;
  achievements: string[];
}

type ProfilePageProps = ProfilePageWithLayout & NextPage<{ user: UserType }>;

const ProfilePage: ProfilePageProps = ({ user }) => {
  const { user: userContext } = useAuth();
  return (
    <Style>
      <header>
        <h1>
          <User set="bulk" /> <span>{user?.fullName}</span>
        </h1>
        <div className="overview">
          <div className="left">
            <Level score={user?.score} size={"lg"} />
            <div>
              <span>{getLevel(user?.score)}</span>
              <h3>{user?.username}</h3>
              <div className="score">
                <div className="value">
                  <Diamond />
                  <span>
                    <b>{getLevelProgress(user?.score)}</b>/100
                  </span>
                </div>
                <div className="progress">
                  <div style={{ width: `${getLevelProgress(user?.score)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          {userContext?.username !== user?.username && (
            <div className="right">
              {user?.isFriend && (
                <Link href={`/messages/${user?.roomId}`} className="btn lg">
                  <Message set="bulk" />
                  <span>Message</span>
                </Link>
              )}
              <AddUnfriend
                id={user?.id}
                username={user?.username}
                isFriend={user?.isFriend}
                isPending={user?.isPending}
                isRequested={user?.isRequested}
              />
              <UserOptions id={user?.id} />
            </div>
          )}
        </div>
        <div className="losses-wins">
          <div>
            <Wins />
            <div>
              <b>{user?.wins}</b>
              <span>Total Wins</span>
            </div>
          </div>
          <div>
            <Losses />
            <div>
              <b>{user?.losses}</b>
              <span>Total losses</span>
            </div>
          </div>
        </div>
      </header>
      <div>
        <h3>Your playing level</h3>
        <div className="level-progress">
          <div className="progress">
            <div style={{ width: `${user?.score / 5}%` }}></div>
          </div>
          <div className="level">
            <Level score={50} size={"md"} />
            <Level score={100} size={"md"} />
            <Level score={200} size={"md"} />
            <Level score={300} size={"md"} />
            <Level score={400} size={"md"} />
            <Level score={500} size={"md"} />
          </div>
        </div>
      </div>
      <Achievements achievements={user?.achievements} />
    </Style>
  );
};
export default ProfilePage;

ProfilePage.getLayout = (page) => ProfileLayout(page, "Profile");

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { profile } = context.query;
  const { jwt } = context.req.cookies;
  let user = null;

  try {
    await axios
      .get(`${process.env.USERS}/getUser?username=${profile}`, {
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      })
      .then((res) => {
        user = {
          id: res.data.id,
          roomId: res.data.roomId || null,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
          username: res.data.login,
          fullName: res.data.fullName,
          avatar: res.data.avatarUrl,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phonenumber,
          country: res.data.country,
          twoFactor: res.data.twofactor,
          wins: res.data.Wins,
          losses: res.data.Losses,
          score: res.data.score,
          isFriend: res.data.isFriend,
          isPending: res.data.isPending,
          isRequested: res.data.isRequested,
          achievements: res.data.achievements,
        };
      });
  } catch (err) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user,
    },
  };
};

const Style = styled.div`
  max-width: 1800px;
  margin: auto;

  header {
    margin-bottom: 55px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .overview {
      gap: 10px;
      @media (max-width: 878px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 30px;
      }
    }
    .left {
      display: flex;
      align-items: center;
      gap: 10px;
      > svg {
        min-width: 100px;
      }
      > div {
        span {
          color: var(--text-300);
          text-transform: capitalize;
        }
        h3 {
          margin-bottom: 5px;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  .losses-wins {
    justify-content: flex-start;
    gap: 24px;
    > div {
      display: flex;
      align-items: center;
      gap: 14px;
      div {
        display: flex;
        flex-direction: column;
        b {
          font-weight: 700;
          font-size: 24px;
          line-height: 150%;
          letter-spacing: -0.011em;
          font-family: var(--font-bold);
        }
        span {
          color: var(--text-200);
        }
      }
    }
    > div:first-child b {
      color: #43ff83;
    }
    > div:last-child b {
      color: var(--danger);
    }
  }
  .score {
    color: var(--text-300);

    .value {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      b {
        margin-left: 5px;
        font-weight: 700;
        font-size: 20px;
        line-height: 30px;
        font-family: var(--font-bold);
        color: #16ade3;
      }
    }
    .progress {
      background: var(--background-200);
      border-radius: 10px;
      width: 271px;
      height: 10px;
      div {
        background: linear-gradient(90deg, #29d5fb 0%, #1a8fdf 100%);
        border-radius: 10px;
        height: 100%;
        max-width: 100%;
      }
    }
  }
  .level-progress {
    width: 100%;
    position: relative;
    .progress {
      background: var(--background-200);
      border-radius: 10px;
      width: 100%;
      height: 13px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      > div {
        background: linear-gradient(90deg, #4200ff 0%, #5e26ff 0.01%, #3104b5 100%);
        border-radius: 10px;
        height: 100%;
        width: 50%;
        max-width: 100%;
      }
    }
    .level {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative;
    }
  }
  > div {
    margin-bottom: 50px;
  }
  h3 {
    margin-bottom: 24px;
    span {
      color: var(--primary);
      font-weight: 600;
      font-size: 2rem;
    }
  }
`;
