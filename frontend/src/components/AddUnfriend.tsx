import { useState, FC, useEffect } from "react";
import styled from "styled-components";
import { AddUser, TimeCircle } from "react-iconly";
import Modal from "react-modal";

import Friend from "@/images/icons/friend.svg";
import CancelFriendReq from "@/components/modals/CancelFriendReq";
import UnfriendModal from "@/components/modals/Unfriend";

Modal.setAppElement("#__next");

interface AddUnfriendProps {
  id: string;
  username: string;
  isPending: boolean;
  isFriend: boolean;
  isRequested: boolean;
}

const Unfriend: FC<AddUnfriendProps> = ({ isFriend, id, username, isPending, isRequested }) => {
  const [pending, setPending] = useState<boolean>(isPending);
  const [friend, setFriend] = useState<boolean>(isFriend);
  const [requested, setRequested] = useState<boolean>(isRequested);
  const [modal, setModal] = useState<boolean>(false);
  const [text, setText] = useState<string>("Friends");
  const [cancelReqText, setCancelReqText] = useState<string>("Pending");

  const handleAddFriend = async () => {
    await fetch(`${process.env.USERS}/sendFriendRequest?id=${id}`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setPending(true);
    });
  };
  const handleAccept = async () => {
    await fetch(`${process.env.USERS}/acceptfriendrequest?id=${id}`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setFriend(true);
      setRequested(false);
      setPending(false);
    });
  };
  const handleDecline = async () => {
    await fetch(`${process.env.USERS}/declineFriendRequest?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setRequested(false);
      setPending(false);
    });
  };

  return (
    <>
      {friend ? (
        <>
          <button
            className="lg secondary"
            style={{ width: "130px" }}
            onClick={() => setModal(true)}
            onMouseEnter={() => setText("Unfriend")}
            onMouseLeave={() => setText("Friends")}
          >
            <Friend />
            <span>{text}</span>
          </button>
          <UnfriendModal
            id={id}
            username={username}
            isOpen={modal}
            setIsOpen={setModal}
            contentLabel="Unfriend"
            setFriend={setFriend}
          />
        </>
      ) : pending ? (
        <>
          <button
            className="lg secondary"
            onClick={() => setModal(true)}
            onMouseEnter={() => setCancelReqText("Cancel Request")}
            onMouseLeave={() => setCancelReqText("Pending")}
          >
            <TimeCircle set="bulk" />
            <span>{cancelReqText}</span>
          </button>
          <CancelFriendReq
            id={id}
            username={username}
            isOpen={modal}
            setIsOpen={setModal}
            contentLabel="Cancel friend request"
            setPending={setPending}
          />
        </>
      ) : requested ? (
        <Buttons>
          <button onClick={handleAccept} className="lg">
            Accept
          </button>
          <button onClick={handleDecline} className="secondary lg">
            Decline
          </button>
        </Buttons>
      ) : (
        <button className="lg" onClick={handleAddFriend}>
          <AddUser set="bulk" />
          <span>add friend</span>
        </button>
      )}
    </>
  );
};

export default Unfriend;

const Buttons = styled.div`
  display: flex;
  width: 300px;
  gap: 10px;
  > * {
    flex: 1;
  }
`;
