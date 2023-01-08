import { FC, useMemo } from "react";
import styled from "styled-components";

interface Props {
  mapName: string;
}
interface StyleProps {
  backgroundColor: string;
}

const Maps: FC<Props> = ({ mapName }) => {
  const styling = useMemo(() => {
    switch (mapName) {
      case "map1":
        return {
          backgroundColor: "#0C5D98",
        };
      case "map2":
        return {
          backgroundColor: "#33862C",
        };
      case "map3":
        return {
          backgroundColor: "#5C0606",
        };
      default:
        return {
          backgroundColor: "#151515",
        };
    }
  }, [mapName]);

  return (
    <Style {...styling}>
      <span></span>
      <span></span>
      <span></span>
    </Style>
  );
};

export default Maps;

const Style = styled.div<StyleProps>`
  background-color: ${(props) => props.backgroundColor};
  position: relative;
  width: 100%;
  height: 100%;
  span {
    position: absolute;
    width: 4px;
    height: 30%;
    background-color: var(--text-100);
    top: 50%;
    transform: translateY(-50%);
  }
  span:nth-child(1) {
    left: 5px;
  }
  span:nth-child(2) {
    right: 5px;
  }
  span:nth-child(3) {
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15px;
    height: 15px;
    border-radius: 15px;
  }
`;
