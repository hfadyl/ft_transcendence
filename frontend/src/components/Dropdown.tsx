import { FC, useState } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  state: boolean;
  target: React.ReactNode;
  useRef?: React.RefObject<HTMLDivElement>;
}
const Dropdown: FC<Props> = ({ children, state, target, useRef }) => {
  return (
    <Style ref={useRef} isActive={state}>
      {target}
      {children}
    </Style>
  );
};

export default Dropdown;

const Style = styled.div<{ isActive: boolean }>`
  position: relative;
  > *:nth-child(2) {
    ${({ isActive }) => (isActive ? "display: block" : "display: none")};
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background-color: var(--background-200);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 10;
    padding: 8px;
    width: 230px;
    max-height: 80vh;
    overflow: auto;

    hr {
      margin: 8px 0;
      border: none;
      border-top: 1px solid var(--border);
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px;
      font-family: var(--font-regular);
      width: 100%;
      color: var(--text-100);
      gap: 10px;
      font-weight: 400;
      border-radius: 5px !important;
      height: auto !important;
      cursor: pointer;

      &:hover {
        background-color: var(--background-100);
      }
      &:focus {
        outline: 2px solid;
        outline-offset: -2px;
        box-shadow: none;
      }

      &.disabled {
        ::after {
          display: none;
        }
      }

      &.danger {
        :hover {
          background-color: var(--danger);
          color: var(--text-100);
          span {
            color: var(--text-100);
          }
        }
      }
    }

    .flex {
      display: flex;
      align-items: center;
      &.between {
        justify-content: space-between;
      }
    }
  }
`;
