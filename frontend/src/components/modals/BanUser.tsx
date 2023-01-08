import { FC } from "react";
import Modale from "@/layout/Modal";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { Props as Interface } from "./interface";

//  merge 2 interfaces
interface Props extends Interface {
  userId: string;
  roomId: string;
  setIsBanned: (value: boolean) => void;
}

const BanUser: FC<Props> = (props) => {
  const { isOpen, setIsOpen, contentLabel, userId, roomId, setIsBanned } = props;
  const handleBan = async () => {
    await axios
      .post(`${process.env.CHAT}/banUser`, { roomId, userId }, { withCredentials: true })
      .then(() => {
        setIsOpen(false);
        setIsBanned(true);
        toast.info("User banned");
      })
      .catch((err) => toast.error(err.response.data));
  };
  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <p>Are you sure you want to ban this user from this room?</p>
      <Style>
        <button onClick={() => setIsOpen(false)} className="secondary">
          Cancel
        </button>
        <button onClick={handleBan} className="danger">
          Ban
        </button>
      </Style>
    </Modale>
  );
};
export default BanUser;

const Style = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 10px;
`;
