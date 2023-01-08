import { FC } from "react";
import Modale from "@/layout/Modal";
import styled from "styled-components";
import { Props as Interface } from "./interface";

interface Props extends Interface {
  setFriend: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  username: string;
}

const Unfriend: FC<Props> = ({ isOpen, setIsOpen, contentLabel, id, username, setFriend }) => {
  const handleUnfriend = async () => {
    await fetch(`${process.env.USERS}/unFriend?id=${id}`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setIsOpen(false);
      setFriend(false);
    });
  };

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <p>Are you sure you want to remove {username} as your friend?</p>
      <Style>
        <button onClick={() => setIsOpen(false)} className="secondary">
          Close
        </button>
        <button onClick={handleUnfriend}>Confirm</button>
      </Style>
    </Modale>
  );
};
export default Unfriend;

const Style = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 10px;
`;
