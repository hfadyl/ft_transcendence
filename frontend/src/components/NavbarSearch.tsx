import React, { FC, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Search as SearchIcon, CloseSquare } from "react-iconly";
import Link from "next/link";
import axios from "axios";

import Diamond from "@/images/icons/diamond.svg";
import Avatar from "@/components/Avatar";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface User {
  id: string;
  username: string;
  avatar: string;
  score: number;
}

interface ResultsProps {
  data: User[];
  onClick: () => void;
}

const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [results, setResults] = useState<Array<User>>([]);
  const [showMobile, setShowMobile] = useState<boolean>(false);

  useOnClickOutside(inputRef, () => {
    setShowResults(false);
    setShowMobile(false);
  });

  useEffect(() => {
    async function fetchUsers() {
      await axios
        .get(process.env.USERS + "/getallusers", {
          withCredentials: true,
        })
        .then((response) => {
          const results = response.data.map((row: any) => {
            return { id: row.id, username: row.login, avatar: row.avatarUrl, score: row.score };
          });
          setUsers(results);
        })
        .catch(() => {});
    }
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.length > 0 && users.length > 0)
      setResults(
        users?.filter((i) => i?.username?.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    else setResults([]);
  };

  const handleClear = () => {
    setValue("");
    setResults([]);
  };

  return (
    <Style ref={inputRef} mobile={showMobile}>
      <div className="search">
        <SearchIcon set="bulk" primaryColor="#7B73AE" />
        <input
          type="search"
          placeholder="Search user ..."
          value={value}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
        />
        {value.length > 0 && (
          <button onClick={handleClear} className="none">
            <CloseSquare set="bulk" primaryColor="#7B73AE" />
          </button>
        )}
        {value.length > 0 && showResults && (
          <Results data={results} onClick={() => setShowResults(false)} />
        )}
      </div>
      <button className="icon md" onClick={() => setShowMobile(true)}>
        <SearchIcon set="bulk" size={20} />
      </button>
    </Style>
  );
};
export default Search;

const Style = styled.div<{ mobile: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  .search {
    align-items: center;
    display: inline-flex;
    position: relative;
    input {
      background-color: var(--background-100);
      padding-left: 40px;
      padding-right: 40px;
      width: 100%;
      border: none;
    }
    > svg {
      position: absolute;
      left: 10px;
    }
    button {
      position: absolute;
      right: 5px;
    }
  }
  > .icon {
    display: none;
    margin-left: auto;
  }

  @media (max-width: 768px) {
    > .search {
      display: ${({ mobile }) => (mobile ? "inline-flex" : "none")};
      ${({ mobile }) =>
        mobile &&
        `
        position: absolute;
        top: 7px;
        left: 0;
        right: 0;
        max-width: 100% !important;
        z-index: 6;
      `};
    }
    > .icon {
      display: inline-flex;
      margin-right: 12px;
      &.close {
        border: 1px solid red;
      }
    }
    ${({ mobile }) =>
      mobile &&
      `
          ::after{
            content: "";
            position: fixed;
            inset: 0;
            background-color: rgb(0 0 0 / 50%);
            backdrop-filter: blur(4px);
            z-index: 5;
            pointer-events: none;
            user-select: none;
          }
        `}
  }
`;

const Results: FC<ResultsProps> = ({ data, onClick }) => {
  return (
    <ResultsStyle onClick={onClick}>
      {data?.length === 0 && <p>No results</p>}
      {data.length > 0 &&
        data?.map((player, index) => (
          <Link href={`/${player.username}`} key={index}>
            <Avatar
              src={player.avatar}
              size={35}
              alt={player.username}
              username={player.username}
              link={false}
            />
            <h6>{player.username}</h6>
            <div>
              <Diamond />
              <span>{player.score}</span>
            </div>
          </Link>
        ))}
    </ResultsStyle>
  );
};
const ResultsStyle = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  background-color: var(--background-200);
  border-radius: 0 0 5px 5px;
  padding: 5px;
  z-index: 1;
  max-height: 90vh;
  overflow: auto;
  > p {
    text-align: center;
    color: var(--text-300);
    padding: 20px 0;
  }
  a {
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
    transition: background-color 200ms ease-in-out;
    display: flex;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-left: auto;
      color: var(--text-300);
    }
    &:hover {
      background-color: #3a3558;
    }
  }
  h6 {
    margin-left: 10px;
    color: var(--text-100);
  }
`;
