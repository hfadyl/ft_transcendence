import { FC, useEffect, useState } from "react";
import Modale from "@/layout/Modal";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Props as Interface } from "./interface";

interface Props extends Interface {
  setTwoFactor: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwoFactor: FC<Props> = ({ isOpen, setIsOpen, contentLabel, setTwoFactor }) => {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setCode("");
    setError("");
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/twoFactor/turnOn", {
      method: "POST",
      body: code,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setTwoFactor(true);
          setIsOpen(false);
          toast.success("Two factor authentication has been enabled");
          setError("");
        } else setError(data.message);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <Style onSubmit={handleSubmit}>
        <div className="qr-code">
          <img
            src={`${process.env.TWO_FACTOR_AUTH}/generate`}
            alt="QR Code"
            height={300}
            width={300}
          />
        </div>
        <label htmlFor="">Code:</label>
        <input
          value={code}
          type="text"
          placeholder="Enter your code"
          onChange={(e) => setCode(e.target.value)}
          className={error ? "error" : ""}
        />
        {error && <p className="error">{error}</p>}
        <button className="lg" type="submit">
          Enable
        </button>
      </Style>
    </Modale>
  );
};
export default TwoFactor;

const Style = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-inline: auto;
  gap: 10px;
  .qr-code {
    width: 300px;
    height: 300px;
    margin: 0 auto 10px;
    background-color: var(--background-200);
    border-radius: 5px;
  }
`;
