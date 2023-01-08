import { useState, FC, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { ProfileLayout, ProfilePageWithLayout } from "@/layout/profile/Layout";
import { GetServerSideProps } from "next";
import { People } from "react-iconly";

import SearchBar from "@/components/SearchInput";
import Avatar from "@/components/Avatar";
import AddUnfriend from "@/components/AddUnfriend";
import Level from "@/components/Level";
import { getLevel } from "@/src/tools";
import { useAuth } from "@/src/context/auth";

interface FriendProps {
  id: string;
  username: string;
  avatar: string;
  isFriend: boolean;
  isRequested: boolean;
  isPending: boolean;
  score: number;
}
const Friend: FC<FriendProps> = ({
  username,
  avatar,
  isFriend,
  score,
  id,
  isRequested,
  isPending,
}) => {
  const store = useAuth();

  return (
    <FriendStyle>
      <Avatar src={avatar} size={90} alt={username} username={username} />
      <h5>{username}</h5>
      <div className="score">
        <Level score={score} size="sm" />
        {getLevel(score)}
      </div>
      {id !== store?.user?.id && (
        <AddUnfriend
          isFriend={isFriend}
          id={id}
          username={username}
          isPending={isPending}
          isRequested={isRequested}
        />
      )}
    </FriendStyle>
  );
};
const FriendStyle = styled.article`
  background: var(--background-200);
  border-radius: 5px;
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  figure {
    margin-bottom: 10px;
  }

  .secondary {
    border: 1px solid var(--border);
  }
  button {
    min-width: 80%;
  }
  .score {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    color: var(--text-200);
    height: 40px;
    svg {
      transform: scale(0.7);
    }
  }
`;
type Props = {
  friends: Array<FriendProps>;
};
const FriendsPage: ProfilePageWithLayout = ({ friends }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Array<FriendProps>>(friends);

  useEffect(() => {
    if (search.length > 0) {
      const filtered = friends.filter((friend) => friend.username.includes(search));
      setResults(filtered);
    } else {
      setResults(friends);
    }
  }, [search, friends]);

  return (
    <Style>
      <header>
        <h1>
          <People set="bulk" />
          <span>Friends List</span>
        </h1>
        <SearchBar setValue={setSearch} value={search} />
      </header>
      <section>
        {results?.length === 0 && <p>No friends found</p>}
        {results?.length > 0 &&
          results?.map((friend, index) => (
            <Friend
              id={friend.id}
              avatar={friend.avatar}
              username={friend.username}
              isFriend={friend.isFriend}
              isPending={friend.isPending}
              isRequested={friend.isRequested}
              score={friend.score}
              key={index}
            />
          ))}
      </section>
    </Style>
  );
};
export default FriendsPage;

const Style = styled.div`
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 30px;
    h1,
    > div {
      margin-bottom: 0;
    }
  }
  .search {
    width: 300px;
  }
  section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 20px;
  }
  @media (max-width: 768px) {
    .search {
      width: 100%;
    }
  }
`;

FriendsPage.getLayout = (page) => ProfileLayout(page, "Friends");

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { profile } = context.query;
  const { jwt } = context.req.cookies;
  let friends: Array<FriendProps> = [];

  try {
    await axios
      .get(`${process.env.USERS}/getFriendsByUsername?username=${profile}`, {
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      })
      .then((res) => {
        friends = res.data.map((friend: any) => {
          return {
            id: friend.id,
            username: friend.login,
            avatar: friend.avatarUrl,
            isFriend: friend.isFriend,
            isRequested: friend.isRequested,
            isPending: friend.isPending,
            score: friend.score,
          };
        });
      });
  } catch (err) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      friends,
    },
  };
};
