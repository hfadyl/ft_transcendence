import { FC } from "react";
import styled from "styled-components";
import CheckIcon from "@/images/icons/check.svg";

interface Props {
  name: string;
  checked: boolean;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  id: string;
  onClick?: () => void;
}

const Checkbox: FC<Props> = ({ name, checked, setState, children, id, onClick }) => {
  return (
    <Style onClick={onClick}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setState && setState((prev) => !prev)}
        id={id}
        name={name}
      />

      <label htmlFor={id}>
        <div>
          <CheckIcon />
        </div>
        {children}
      </label>
    </Style>
  );
};

export default Checkbox;

const Style = styled.div`
  input[type="checkbox"] {
    display: none;
  }
  label {
    cursor: pointer;
    margin-bottom: 0;
    display: flex;
    width: 100%;
    align-items: center;
    gap: 5px;
  }
  input[type="checkbox"]:checked + label {
    div svg {
      opacity: 1;
    }
  }

  label > div {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background-color: var(--background-200);
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      opacity: 0;
    }
  }
`;
