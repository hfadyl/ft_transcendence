import { ProfileLayout, ProfilePageWithLayout } from "@/layout/profile/Layout";
import { GetServerSideProps } from "next";
import { Paper } from "react-iconly";
import styled from "styled-components";
import Link from "next/link";
import axios from "axios";

import Avatar from "@/components/Avatar";

type User = {
  avatar: string;
  username: string;
  results: string;
  maxViews: number;
  earnedScore: number;
  date: string;
  status: string;
};
interface Props {
  username: string;
  data: User[];
}

const MatchHistoryPage: ProfilePageWithLayout = ({ username, data }: Props) => {
  return (
    <Style>
      <header>
        <h1>
          <Paper set="bulk" />
          <span>Match History</span>
        </h1>
        <div className="total">
          Total <span>{data?.length} matches</span>
        </div>
      </header>

      {data?.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Players</th>
              <th>Results</th>
              <th>Max views</th>
              <th>Earned score</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((player: User, index: number) => (
              <tr key={index}>
                <td>
                  <Avatar size={35} src={player.avatar} />
                  <Link href={`/${player.username}`}>{player.username}</Link> vs
                  <span>{username}</span>
                </td>
                <td>{player.results}</td>
                <td>{player.maxViews}</td>
                <td>{player.earnedScore}</td>
                <td>{player.date}</td>
                <td>
                  <span className={player.status}>{player.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data?.length === 0 && <p className="no-data">No match history yet.</p>}
    </Style>
  );
};

export default MatchHistoryPage;

MatchHistoryPage.getLayout = (page) => ProfileLayout(page, "Match History");

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { profile } = context.query;
  const { jwt } = context.req.cookies;
  let data = null;

  try {
    await axios
      .get(`${process.env.GAME}/getMatchHistory?username=${profile}`, {
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      })
      .then((res) => {
        data = res.data;
      });
  } catch (err) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data,
      username: profile,
    },
  };
};

const Style = styled.div`
  height: 100%;
  header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    h1 {
      margin-bottom: 0;
    }
    .total {
      span {
        color: var(--primary);
      }
      ::before {
        content: "•";
        margin: 0 25px;
      }
    }
  }

  a {
    color: var(--text-100);
    :hover {
      color: var(--primary);
    }
  }
  .no-data {
    color: var(--text-200);
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    border-spacing: 0;

    // table header
    thead {
      tr {
        th {
          padding-bottom: 5px;
          font-weight: 500;
          color: var(--text-200);

          :last-child {
            text-align: right;
          }
        }
      }
    }

    // table body
    tbody {
      tr {
        :nth-child(2n + 2) {
          background-color: var(--background-200);
        }
        td {
          padding: 15px 0;

          :first-child {
            font-family: var(--font-medium);
            display: flex;
            align-items: center;
            gap: 10px;
            padding-left: 10px;
            border-bottom-left-radius: 5px;
            border-top-left-radius: 5px;
          }
          :last-child {
            border-bottom-right-radius: 5px;
            border-top-right-radius: 5px;
            padding-right: 10px;
            text-align: right;
            span {
              display: inline-block;
              border-radius: 5px;
              padding: 5px 10px;
              width: 55px;
              text-align: center;
              &.win {
                background-color: #007829;
              }
              &.lose {
                background-color: #921624;
              }
            }
          }
        }
      }
    }
  }
`;
