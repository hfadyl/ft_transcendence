import { FC } from "react";
import Modale from "@/layout/Modal";
import styled from "styled-components";
import { Props as Interface } from "./interface";

interface Props extends Interface {
  id: string;
  username: string;
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
}

const CancelFriendReq: FC<Props> = (props) => {
  const { isOpen, setIsOpen, contentLabel, id, username, setPending } = props;

  const handleCancel = async () => {
    await fetch(`${process.env.USERS}/cancelFriendRequest?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setIsOpen(false);
      setPending(false);
    });
  };

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <p>Are you sure you want to cancel your friend request to {username}?</p>
      <Style>
        <button onClick={() => setIsOpen(false)} className="secondary">
          Close
        </button>
        <button onClick={handleCancel}>Confirm</button>
      </Style>
    </Modale>
  );
};
export default CancelFriendReq;

const Style = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 10px;
`;
