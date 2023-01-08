import { FC } from "react";
import Modale from "@/layout/Modal";
import styled from "styled-components";
import { useAuth } from "@/src/context/auth";
import { useRouter } from "next/router";
import { Props as Interface } from "./interface";

interface Props extends Interface {
  id: string;
}

const BlockUser: FC<Props> = ({ isOpen, setIsOpen, contentLabel, id }) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleBlock = async () => {
    await fetch(`${process.env.USERS}/blockUser?id=${id}`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setIsOpen(false);
      router.push(`/${user?.username}/blockList`);
    });
  };

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <p>Are you sure you want to block this user?</p>
      <Style>
        <button onClick={() => setIsOpen(false)} className="secondary">
          Cancel
        </button>
        <button onClick={handleBlock} className="danger">
          Block
        </button>
      </Style>
    </Modale>
  );
};
export default BlockUser;

const Style = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 10px;
`;
