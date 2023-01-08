import { useState } from "react";
import { GetServerSideProps } from "next";
import type { NextPage } from "next";
import styled from "styled-components";
import { Login } from "react-iconly";
import axios from "axios";
import { useRouter } from "next/router";

import { useAuth } from "@/src/context/auth";
import Head from "@/layout/Head";
import AvatarUpload from "@/components/AvatarUpload";
import { usernameValidation } from "@/src/tools";

import Logo from "@/images/brand/brand.svg";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data = {
    username: "",
    avatar: "",
  };
  try {
    await axios
      .get(`${process.env.USERS}/me`, {
        headers: {
          Cookie: `jwt=${context.req.cookies.jwt}`,
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
      oldUsername: data.username,
      avatar: data.avatar,
    },
  };
};

interface Props {
  oldUsername: string;
  avatar: string;
}

const UsernameLogin: NextPage<Props> = ({ oldUsername, avatar }) => {
  const [username, setUsername] = useState<string>(oldUsername);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { setUsername: ChangeUsername } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validUsername = usernameValidation(username);
    if (validUsername !== "") {
      setError(validUsername);
      return;
    }

    if (username.toLocaleLowerCase() !== oldUsername.toLocaleLowerCase()) {
      await axios
        .put("/api/updates/username", { data: username.toLocaleLowerCase() })
        .then((res) => {
          if (res.status === 200) {
            ChangeUsername(username.toLocaleLowerCase());
            router.push("/");
          }
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } else router.push("/");
  };

  return (
    <>
      <Head title="Create Username | Ping Pong Champion" />
      <Style>
        <div>
          <header>
            <Logo />
          </header>
          <div className="avatar">
            <AvatarUpload src={avatar} size={100} />
            <h4>{username}</h4>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label htmlFor={`username-${username}`}>Username:</label>
            <input
              className={error ? "error" : ""}
              type="text"
              value={username}
              id={`username-${username}`}
              placeholder="Enter a uniq username..."
              onChange={(e) => setUsername(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="lg">
              <span>continue</span>
              <Login set="bulk" />
            </button>
          </form>
        </div>
      </Style>
    </>
  );
};
export default UsernameLogin;

export const Style = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;

  > div {
    width: 540px;
    background-color: var(--background-200);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 40px;

    @media (max-width: 768px) {
      width: 90%;
      padding: 40px 25px;
    }
  }
  .avatar {
    text-align: center;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  header {
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  form {
    display: flex;
    flex-direction: column;
    input {
      margin-bottom: 10px;
    }
    button {
      margin-top: 20px;
    }
  }
`;
