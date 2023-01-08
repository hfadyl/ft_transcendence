import { useState } from "react";
import { ProfileLayout, ProfilePageWithLayout } from "@/layout/profile/Layout";
import { GetServerSideProps } from "next";
import { ShieldFail } from "react-iconly";
import Avatar from "@/components/Avatar";
import styled from "styled-components";

interface User {
  id: string;
  avatarUrl: string;
  login: string;
}

const BlockList: ProfilePageWithLayout = ({ list }: { list: User[] }) => {
  const [listUser, setListUser] = useState<User[]>(list);

  const handleUnblock = async (id: string) => {
    await fetch(`${process.env.USERS}/unblockUser?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => setListUser((prev) => prev.filter((user) => user.id !== id)));
  };

  return (
    <>
      <h1>
        <ShieldFail set="bulk" />
        <span>Block List</span>
      </h1>
      <div>
        {listUser?.length === 0 && <p>There is no user in your block list</p>}
        {listUser?.map((user, key) => (
          <Row key={key}>
            <Avatar src={user.avatarUrl} size={40} alt={user.login} />
            <p>{user.login}</p>
            <button className="secondary" onClick={() => handleUnblock(user?.id)}>
              unblock
            </button>
          </Row>
        ))}
      </div>
    </>
  );
};

export default BlockList;

BlockList.getLayout = (page) => ProfileLayout(page, "Block List");

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  :hover {
    background-color: var(--background-200);
  }
  > p {
    margin-left: 10px;
  }
  > button {
    margin-left: auto;
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { jwt } = context.req.cookies;
  let list: User[] = [];

  await fetch(`${process.env.USERS}/getblockedUsers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      list = data;
    });
  return {
    props: {
      list,
    },
  };
};
