import { FC, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { VolumeOff, VolumeUp, Game, User, CloseSquare, Logout } from "react-iconly";

import Dropdown from "@/components/Dropdown";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import DotsIcon from "@/images/icons/dots.svg";
import MuteUserModal from "@/components/modals/MuteUser";
import BanUserModal from "@/components/modals/BanUser";
import { useInvitePlayer } from "@/hooks/useInvitePlayer";
import { useSocket } from "@/src/context/socket";

interface Props {
  roomId: string;
  userId: string;
  username: string;
  isAdmin: boolean;
  isOwner: boolean;
  isParticipantOwner: boolean;
  isParticipantAdmin: boolean;
  isMutted: boolean;
  isBanned: boolean;
}

const ParticipantsOptions: FC<Props> = (props) => {
  const {
    roomId,
    userId,
    username,
    isAdmin,
    isOwner,
    isParticipantOwner,
    isParticipantAdmin,
    isMutted: mutted,
    isBanned: banned,
  } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const [drop, setDrop] = useState<boolean>(false);
  const [modalMute, setModalMute] = useState<boolean>(false);
  const [modalBan, setModalBan] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(banned);
  const [isMutted, setIsMutted] = useState<boolean>(mutted);
  const { handleInvite } = useInvitePlayer();
  const { getStatus } = useSocket();

  useOnClickOutside(divRef, () => setDrop(false));

  const handleAdmin = async () => {
    await axios
      .post(`${process.env.CHAT}/makeUserAdmin`, { roomId, userId }, { withCredentials: true })
      .then((res) => toast.info(res.data.message))
      .catch((err) => toast.error(err.response.data.message));
  };
  const handleRemoveAdmin = async () => {
    await axios
      .post(`${process.env.CHAT}/unmakeUserAdmin`, { roomId, userId }, { withCredentials: true })
      .then((res) => {
        toast.info(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleUnBan = async () => {
    try {
      await axios
        .post(`${process.env.CHAT}/unbanUser`, { roomId, userId }, { withCredentials: true })
        .then((res) => {
          toast.success(res.data.message);
          setIsBanned(false);
        })
        .catch((err) => toast.error(err.response.data.message));
    } catch (err) {}
  };

  const handleUnMute = async () => {
    try {
      await axios
        .post(`${process.env.CHAT}/unMuteUser`, { roomId, userId }, { withCredentials: true })
        .then((res) => {
          toast.success(res.data.message);
          setIsMutted(false);
        })
        .catch((err) => toast.error(err.response.data.message));
    } catch (err) {}
  };

  const handleKick = async () => {
    try {
      await axios
        .delete(`${process.env.CHAT}/removeUser`, {
          data: { roomId, userId },
          withCredentials: true,
        })
        .then((res) => toast.success(res.data.message))
        .catch((err) => toast.error(err.response.data.message));
    } catch (err) {}
  };

  return (
    <Dropdown
      state={drop}
      useRef={divRef}
      target={
        <button className="icon" onClick={() => setDrop((prev) => !prev)}>
          <DotsIcon />
        </button>
      }
    >
      <ul onClick={() => setDrop(false)}>
        <li>
          <button
            className={`none item ${getStatus(username) === "online" ? "" : "disabled"}`}
            onClick={() => getStatus(username) === "online" && handleInvite(username)}
          >
            <Game set="bulk" />
            <span>Invite to play</span>
          </button>
        </li>

        {isOwner && !isParticipantOwner && (
          <>
            {isParticipantAdmin ? (
              <li>
                <button className="none item" onClick={handleRemoveAdmin}>
                  <User set="bulk" />
                  <span>Remove group admin</span>
                </button>
              </li>
            ) : (
              <li>
                <button className="none item" onClick={handleAdmin}>
                  <User set="bulk" />
                  <span>Make group admin</span>
                </button>
              </li>
            )}
          </>
        )}
        {(isAdmin || isOwner) && !isParticipantOwner && (
          <li>
            <button className="none item danger" onClick={handleKick}>
              <Logout set="bulk" />
              <span>Kick</span>
            </button>
          </li>
        )}
        {isAdmin && !isParticipantOwner && (
          <>
            {isMutted ? (
              <li>
                <button className="none item" onClick={handleUnMute}>
                  <VolumeUp set="bulk" />
                  <span>unMute</span>
                </button>
              </li>
            ) : (
              <li>
                <button className="none item" onClick={() => setModalMute(true)}>
                  <VolumeOff set="bulk" />
                  <span>Mute</span>
                </button>
                <MuteUserModal
                  roomId={roomId}
                  userId={userId}
                  isOpen={modalMute}
                  setIsOpen={setModalMute}
                  contentLabel="Mute User for a limited time"
                  setIsMutted={setIsMutted}
                />
              </li>
            )}
            {isBanned ? (
              <li>
                <button className="none item" onClick={handleUnBan}>
                  <CloseSquare set="bulk" />
                  <span>Unban</span>
                </button>
              </li>
            ) : (
              <li>
                <button className="none item danger" onClick={() => setModalBan(true)}>
                  <CloseSquare set="bulk" />
                  <span>ban</span>
                </button>
                <BanUserModal
                  roomId={roomId}
                  userId={userId}
                  isOpen={modalBan}
                  setIsOpen={setModalBan}
                  contentLabel="Ban User for good"
                  setIsBanned={setIsBanned}
                />
              </li>
            )}
          </>
        )}
      </ul>
    </Dropdown>
  );
};
export default ParticipantsOptions;
