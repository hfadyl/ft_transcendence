import { FC } from "react";
import styled from "styled-components";
import { People } from "react-iconly";

const GroupDefaultAvatar: FC<{ size: number }> = ({ size }) => {
  return (
    <Style size={size} className="avatar">
      <People set="bulk" size={size / 2.5} />
    </Style>
  );
};
export default GroupDefaultAvatar;

const Style = styled.figure<{ size: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(p) => p.size}px;
  background-color: var(--border);
`;
