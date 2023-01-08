import styled from "styled-components";

import Avatar from "@/components/Avatar";
import Modal from "@/layout/Modal";
import { useFriends } from "@/hooks/useFriends";
import { useInvitePlayer } from "@/src/hooks/useInvitePlayer";
import { useSocket } from "@/src/context/socket";
import { Props } from "./interface";

const InvitePlayer: React.FC<Props> = ({ isOpen, setIsOpen, contentLabel }) => {
  const { handleInvite } = useInvitePlayer();
  const friends = useFriends();
  const { getStatus } = useSocket();

  const handleInvitePlayer = async (username: string) => {
    handleInvite(username);
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <ul>
        {friends.filter((friend) => getStatus(friend.username) === "online").length === 0 && (
          <p>there is no online friends</p>
        )}
        {friends
          .filter((friend) => getStatus(friend.username) === "online")
          .map((friend, index) => (
            <Row key={index}>
              <div>
                <Avatar
                  src={friend.avatar}
                  size={40}
                  alt={friend.username}
                  username={friend.username}
                  link={false}
                />
                <h5>{friend.username}</h5>
              </div>
              <button onClick={() => handleInvitePlayer(friend.username)}>invite</button>
            </Row>
          ))}
      </ul>
    </Modal>
  );
};
export default InvitePlayer;

const Row = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  :nth-child(even) {
    background-color: var(--background-200);
  }
  h5 {
    margin-left: 1rem;
    span {
      color: var(--text-300);
      font-family: var(--font-light);
    }
  }
  > div {
    display: flex;
    align-items: center;
  }
`;
