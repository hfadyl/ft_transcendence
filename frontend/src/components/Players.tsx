import styled from "styled-components";
import Avatar from "./Avatar";
import Diamond from "../../public/images/icons/diamond.svg";

interface Props {
  player1: any;
  player2: any;
  frontWidth: any;
  leftScore: number;
  rightScore: number;
  player1Points: number;
  player2Points: number;
}
interface StyleProps {
  frontWidth?: any;
}

interface PlayerProps {
  player2?: any;
}

const Players: React.FC<Props> = ({
  player1,
  player2,
  frontWidth,
  leftScore,
  rightScore,
  player1Points,
  player2Points,
}) => {
  return (
    <Style frontWidth={frontWidth}>
      <Player>
        <Avatar src={player1?.avatar} username={player1?.username} />
        <div>
          <span>{player1?.username}</span>
          <span>
            <Diamond />
            <span>{player1Points}</span>
          </span>
        </div>
      </Player>

      {player2 && (
        <Score>
          <span>{leftScore}</span>
          <span>|</span>
          <span>{rightScore}</span>
        </Score>
      )}

      {player2 && (
        <Player player2>
          <Avatar src={player2?.avatar} username={player2?.username} />
          <div>
            <span>{player2?.username}</span>
            <span>
              <span>
                <Diamond />
              </span>
              <span>{player2Points}</span>
            </span>
          </div>
        </Player>
      )}
    </Style>
  );
};

export default Players;

const Style = styled.section<StyleProps>`
  margin-top: 60px;
  width: ${(props) => props.frontWidth * 0.8}px;
  padding: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  span:nth-child(2) {
    margin: 0 10px;
    opacity: 0.5;
  }
`;

const Player = styled.div<PlayerProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.player2 ? "row-reverse" : "row")};
  figure {
    margin-right: ${(props) => (props.player2 ? "0" : "10px")};
  }
  div {
    margin-right: ${(props) => (props.player2 ? "10px" : "0")};
    justify-content: ${(props) => (props.player2 ? "flex-end" : "flex-start")};
    span {
      display: flex;
      justify-content: ${(props) => (props.player2 ? "flex-end" : "flex-start")};
      &:last-child {
        display: flex;
        align-items: center;
        svg {
          margin-right: 5px;
        }
      }
    }
  }
  @media (width < 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    figure {
      margin-right: 0;
    }
    div {
      margin-right: 0;
      justify-content: center;
    }
  }
`;
