import styled from "styled-components";
import { Game } from "react-iconly";
import Views from "../../public/images/icons/views.svg";

interface Props {
  mapName: string | string[] | undefined;
  views: any;
  frontWidth?: number;
}

interface StyleProps {
  frontWidth?: any;
}

const MapData: React.FC<Props> = ({ mapName, views, frontWidth }) => {
  return (
    <Style frontWidth={frontWidth}>
      <div>
        <Game set="bulk" />
        <span>{mapName}</span>
      </div>
      <div>
        <Views />
        <span>{views}</span>
      </div>
    </Style>
  );
};

export default MapData;

const Style = styled.section<StyleProps>`
  width: ${(props) => props.frontWidth * 0.8}px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
    svg {
      margin-right: 10px;
    }
  }
`;
