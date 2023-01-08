import { FC, useState } from "react";
import styled from "styled-components";
import { Notification, Logout, Password, ChevronRight } from "react-iconly";
import { toast } from "react-toastify";
import axios from "axios";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/router";

import Copy from "@/images/icons/copy.svg";
import Refresh from "@/images/icons/refresh.svg";
import Avatar from "@/components/Avatar";
import ChatRoomParticipants from "@/layout/messenger/ChatRoomParticipants";
import { InfoProps } from "@/layout/messenger/interfaces";

const Informations: FC<InfoProps> = ({ data, toggle, setToggle, roomId, setState, state }) => {
  const { id, name, avatar, participants, isAdmin, isOwner } = data;
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleChangePassword = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    await axios
      .post(`${process.env.CHAT}/changePassword`, { id, password }, { withCredentials: true })
      .then((res) => toast.success(res.data.message))
      .catch((err) => toast.error(err.response.data.message));
  };

  const handleRemovePassword = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await axios
      .delete(`${process.env.CHAT}/deletePassword`, {
        withCredentials: true,
        data: { roomId: id },
      })
      .then(() => {
        toast.success("Password removed, room is now private");
        setState("private");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const generatePassword = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const length = 15;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
  };

  const copyToClipboard = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard");
  };

  const handleExit = async () => {
    await axios
      .delete(`${process.env.CHAT}/leaveRoom`, {
        withCredentials: true,
        data: { roomId: id },
      })
      .then((res) => {
        toast.success(res.data.message);
        router.push("/");
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <Style className="informations" toggle={toggle}>
      <button className="toggle icon md" onClick={() => setToggle(false)}>
        <ChevronRight set="bulk" />
      </button>
      <header>
        <Avatar src={avatar || ""} alt={name} size={130} />
        <h3>{name}</h3>
        <div className="actions">
          <button className="icon md disabled">
            <Notification set="bulk" />
          </button>
          <Tippy content="Leave room" placement="bottom">
            <button className="icon md" onClick={handleExit}>
              <Logout set="bulk" />
            </button>
          </Tippy>
        </div>
      </header>
      {state === "protected" && isOwner && (
        <PasswordForm>
          <label htmlFor="password">change passworld</label>
          <div className="input-group">
            <Password set="bulk" primaryColor="#7B73AE" />
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="passworld"
              placeholder="jkhJKGHsd52kadK..."
            />
            <div className="btns">
              <button className="none" onClick={copyToClipboard}>
                <Copy />
              </button>
              <button className="none" onClick={generatePassword}>
                <Refresh />
              </button>
            </div>
          </div>
          <div className="actions">
            <button onClick={handleChangePassword}>Change</button>
            <button onClick={handleRemovePassword} className="danger">
              remove
            </button>
          </div>
        </PasswordForm>
      )}
      {participants && (
        <ChatRoomParticipants
          participants={participants}
          roomId={roomId}
          isAdmin={isAdmin}
          isOwner={isOwner}
        />
      )}
    </Style>
  );
};
export default Informations;

const Style = styled.aside<{ toggle: boolean }>`
  padding: 30px 10px 30px 10px;
  ${(props) => (props.toggle ? "display:block;" : "display:none;")}
  .toggle {
    display: none;
    @media (max-width: 992px) {
      display: flex;
    }
  }
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 20px;
    .actions {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
    }
    h3 {
      margin-top: 10px;
    }
  }
`;
const PasswordForm = styled.form`
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 20px;
  .input-group {
    position: relative;
    input {
      width: 100%;
      padding-left: 42px;
      padding-right: 55px;
    }
    > svg {
      position: absolute;
      top: 11px;
      left: 10px;
    }
    .btns {
      position: absolute;
      right: 10px;
      top: 15px;
      display: flex;
      gap: 5px;
      align-items: center;
      button {
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
  .actions {
    display: flex;
    gap: 5px;
    margin-top: 5px;
    button {
      flex: 1;
    }
  }
`;
