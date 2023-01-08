import { FC, useState } from "react";
import Modale from "@/layout/Modal";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { Props as Interface } from "./interface";

interface Props extends Interface {
  roomId: string;
  userId: string;
  setIsMutted: React.Dispatch<React.SetStateAction<boolean>>;
}

type MuteDuration = "2m" | "1w" | "8h" | "1d";

const MuteUser: FC<Props> = (props) => {
  const { isOpen, setIsOpen, contentLabel, roomId, userId, setIsMutted } = props;
  const [duration, setDuration] = useState<MuteDuration>("2m");

  const handleMute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(`${process.env.CHAT}/muteUser`, { roomId, userId, duration }, { withCredentials: true })
      .then(() => {
        setIsOpen(false);
        setIsMutted(true);
        toast.info("User is Mutted");
      })
      .catch((err) => toast.error(err.response.data));
  };

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <Style>
        <p>Mute user for limited time or forever</p>
        <form onSubmit={(e) => handleMute(e)}>
          <div className="radio-group">
            {["2m", "1w", "8h", "1d"].map((d, i: number) => (
              <div key={i}>
                <input
                  type="radio"
                  id={d}
                  name="duration"
                  value={d}
                  checked={duration === d}
                  onChange={() => setDuration(d as MuteDuration)}
                />
                <label htmlFor={d} className={duration === d ? "btn lg" : "btn lg secondary"}>
                  {d}
                </label>
              </div>
            ))}
          </div>
          <div className="actions">
            <button onClick={() => setIsOpen(false)} className="secondary">
              Cancel
            </button>
            <button type="submit">Mute</button>
          </div>
        </form>
      </Style>
    </Modale>
  );
};
export default MuteUser;

const Style = styled.div`
  .radio-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    > div {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    input[type="radio"] {
      display: none;
    }
    label {
      margin: 0;
      width: 100%;
    }
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    gap: 10px;
  }
`;
