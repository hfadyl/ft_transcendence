import { useState } from "react";
import Modal from "react-modal";
import DeleteAccountModal from "@/components/modals/DeleteAccount";
import { Delete } from "react-iconly";

Modal.setAppElement("#__next");

const DeleteAccount = () => {
  const [deleteAccountModal, setDeleteAccountModal] = useState<boolean>(false);

  return (
    <>
      <div className="danger-zone">
        <label>Danger Zone</label>
        <button className="lg outline danger" onClick={() => setDeleteAccountModal(true)}>
          <Delete set="bulk" />
          <span>Delete Account</span>
        </button>
      </div>
      <DeleteAccountModal
        isOpen={deleteAccountModal}
        setIsOpen={setDeleteAccountModal}
        contentLabel="Delete Your account Account"
      />
    </>
  );
};

export default DeleteAccount;
