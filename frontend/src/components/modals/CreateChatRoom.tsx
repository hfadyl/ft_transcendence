import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { TwoUsers, Lock, Password, Chat } from "react-iconly";

import { useFriends } from "@/hooks/useFriends";
import { useRooms } from "@/hooks/useRooms";
import { roomNameValidation } from "@/src/tools";
import Modal from "@/layout/Modal";
import Avatar from "@/components/Avatar";
import Copy from "@/images/icons/copy.svg";
import Refresh from "@/images/icons/refresh.svg";
import CheckIcon from "@/images/icons/check.svg";
import { Props } from "./interface";

const CreateChatRoom: FC<Props> = ({ isOpen, setIsOpen, contentLabel }) => {
  const [name, setName] = useState<string>("");
  const [state, setState] = useState<"public" | "private" | "protected">("public");
  const [password, setPassword] = useState<string | null>(null);
  const [activePassword, setActivePassword] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const friends = useFriends();
  const { createRoom, createError } = useRooms();

  useEffect(() => {
    if (state === "protected") setActivePassword(true);
    else setActivePassword(false);
  }, [state]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    const validUsername = roomNameValidation(name);
    if (validUsername !== "") {
      setError(validUsername);
      return;
    }
    if (password === null && state === "protected") return setError("Password is required");
    if (password !== null && (password.length < 6 || password.length > 20))
      return setError("Password must be at least 6 characters and max is 20");
    createRoom(name, state, password, participants);
    if (createError) setError(createError);
    else {
      setIsOpen(false);
      setName("");
      setState("public");
      setPassword(null);
      setParticipants([]);
    }
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
    if (password === null) return;
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard");
  };

  const handleParticipants = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setParticipants((prev) => {
      if (prev.includes(value)) return prev.filter((item) => item !== value);
      else return [...prev, value];
    });
  };

  return (
    <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <Style onSubmit={handleSubmit}>
        <div className="name">
          <Avatar size={100} />
          <div>
            <label htmlFor="">room name</label>
            <input
              type="text"
              placeholder="choose a name for your chart room"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex">
          <div className="stats">
            <label>room state</label>
            <div className="row">
              <div>
                <input
                  type="radio"
                  name="state"
                  id="public"
                  value="public"
                  checked={state === "public"}
                  onChange={(e) => setState(e.target.value as "public" | "private" | "protected")}
                />
                <label htmlFor="public">
                  <TwoUsers set="bulk" />
                  <span>public</span>
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="state"
                  id="private"
                  value="private"
                  checked={state === "private"}
                  onChange={(e) => setState(e.target.value as "public" | "private" | "protected")}
                />
                <label htmlFor="private">
                  <Lock set="bulk" />
                  <span>private</span>
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="state"
                  id="protected"
                  value="protected"
                  checked={state === "protected"}
                  onChange={(e) => setState(e.target.value as "public" | "private" | "protected")}
                />
                <label htmlFor="protected">
                  <Password set="bulk" />
                  <span>protected</span>
                </label>
              </div>
            </div>
          </div>
          {activePassword && (
            <div className="password">
              <label htmlFor="">password</label>
              <div className="input-group">
                <Password set="bulk" primaryColor="#7B73AE" />
                <input
                  type="text"
                  value={password || ""}
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
            </div>
          )}
        </div>
        <div>
          <label htmlFor="">Invite friends:</label>
          <div className="friends">
            {friends.length === 0 && <p>You have no friends yet</p>}
            {friends?.map((friend, index) => (
              <Friend key={index}>
                <input
                  type="checkbox"
                  name="friend"
                  value={friend.id}
                  id={`_${friend.username}`}
                  onChange={handleParticipants}
                />
                <label htmlFor={`_${friend.username}`}>
                  <Avatar
                    src={friend.avatar}
                    size={30}
                    alt={friend.username}
                    username={friend.username}
                    link={false}
                  />
                  <span>{friend.username}</span>
                  <CheckBox className="checkbox">
                    <CheckIcon />
                  </CheckBox>
                </label>
              </Friend>
            ))}
          </div>
        </div>
        <button type="submit" className="lg">
          <Chat set="bulk" />
          <span>submit</span>
        </button>
        {error && <p className="error">{error}</p>}
      </Style>
    </Modal>
  );
};
export default CreateChatRoom;

const Style = styled.form`
  button[type="submit"] {
    width: 100%;
    margin-top: 20px;
  }
  .flex {
    display: flex;
    gap: 5px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .name {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 20px;
    > div {
      flex: 1;
      min-width: 200px;
    }
  }
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
  .stats {
    svg {
      min-width: 20px;
      max-width: 20px;
    }
    .row {
      width: 100%;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
      > div {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        label {
          cursor: pointer;
          background-color: var(--background-300);
          border: 1px solid #393061;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
          padding: 10px;
          border-radius: 5px;
        }
      }
    }
    input {
      display: none;
      &:checked + label {
        background: var(--primary);
      }
    }
  }
  .password {
    flex: 1;
  }
  .friends {
    background-color: var(--background-300);
    border-radius: 5px;
    padding: 10px;
    flex-wrap: wrap;
    display: flex;
    gap: 5px;
  }
  .error {
    color: var(--danger);
    margin-top: 15px;
    text-align: center;
  }
`;
const Friend = styled.div`
  label {
    background-color: var(--border);
    border-radius: 5px;
    cursor: pointer;
    padding: 5px 10px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0;
    user-select: none;
  }
  img {
    pointer-events: none;
  }
  input[type="checkbox"] {
    display: none;
  }
  input[type="checkbox"]:checked + label {
    background-color: var(--primary);
    .checkbox svg {
      opacity: 1;
    }
  }
`;
const CheckBox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background-color: var(--background-100);
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    opacity: 0;
  }
`;
