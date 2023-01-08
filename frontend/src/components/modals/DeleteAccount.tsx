import { FC } from "react";
import Modale from "@/layout/Modal";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Props } from "./interface";
import { useAuth } from "@/src/context/auth";

const DeleteAccount: FC<Props> = ({ isOpen, setIsOpen, contentLabel }) => {
  const { logout } = useAuth();

  const handleDelete = async () => {
    await fetch(`${process.env.USERS}/deleteUser`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpen(false);
        toast.success(data.message);
        logout();
      });
  };

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      <Style>
        <button onClick={() => setIsOpen(false)} className="secondary">
          Close
        </button>
        <button onClick={handleDelete} className="danger">
          Confirm
        </button>
      </Style>
    </Modale>
  );
};
export default DeleteAccount;

const Style = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 10px;
`;
