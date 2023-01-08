import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

import TwoFactorModal from "@/components/modals/TwoFactor";
import Checkbox from "@/components/Checkbox";

Modal.setAppElement("#__next");

const TwoFactor = ({ state }: { state: boolean }) => {
  const [twoFactorModal, setModal] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(state);

  const handleModal = async () => {
    if (!isChecked) {
      setModal(true);
      return;
    }
    await fetch("/api/twoFactor/turnOff", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setIsChecked(false);
          toast.success("Two factor authentication has been disabled");
        } else toast.error(data.message);
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <>
      <div className="two-factor">
        <Checkbox onClick={handleModal} name="isTwoFactor" id="two-factor" checked={isChecked}>
          Two Factor Authentication
        </Checkbox>
        <p>
          you will need to scan a QR code to enable this feature
          <br />
          once you enable this feature you will need to use a code to login
        </p>
      </div>
      <TwoFactorModal
        isOpen={twoFactorModal}
        setIsOpen={setModal}
        contentLabel="Scan QR Code to enable Two Factor Authentication"
        setTwoFactor={setIsChecked}
      />
    </>
  );
};

export default TwoFactor;
