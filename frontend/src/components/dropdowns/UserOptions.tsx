import { FC, useState, useRef } from "react";
import { Danger } from "react-iconly";
import { toast } from "react-toastify";

import Dropdown from "@/components/Dropdown";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import DotsIcon from "@/images/icons/dots.svg";
import BlockUserModal from "@/components/modals/BlockUser";

interface Props {
  id: string;
  isBlocked?: boolean;
  setIsBlocked?: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserOptions: FC<Props> = ({ id, isBlocked, setIsBlocked }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [drop, setDrop] = useState<boolean>(false);
  const [modalBlock, setModalBlock] = useState<boolean>(false);

  useOnClickOutside(divRef, () => setDrop(false));

  const handleUnblock = async () => {
    if (!setIsBlocked) return;
    await fetch(`${process.env.USERS}/unblockUser?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      toast.success("User unblocked");
      setIsBlocked(false);
      setDrop(false);
    });
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
      <ul>
        <li>
          {isBlocked ? (
            <button className="none item" onClick={handleUnblock}>
              <Danger set="bulk" />
              <span>Unblock</span>
            </button>
          ) : (
            <button className="none item danger" onClick={() => setModalBlock(true)}>
              <Danger set="bulk" />
              <span>Block</span>
            </button>
          )}
          <BlockUserModal
            id={id}
            isOpen={modalBlock}
            setIsOpen={setModalBlock}
            contentLabel="Block User"
          />
        </li>
      </ul>
    </Dropdown>
  );
};
export default UserOptions;
