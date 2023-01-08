import { FC } from "react";
import { Props as Interface } from "./interface";
import styled from "styled-components";
import { useSound } from "use-sound";

import Modale from "@/layout/Modal";
import { achievementsList } from "@/src/achievements";
import { CardStyle } from "@/components/Achievements";
import GridEffect from "@/components/GridEffect";

interface Props extends Interface {
  achievements: string[];
}

const Achievement: FC<Props> = ({ isOpen, setIsOpen, contentLabel, achievements }) => {
  const [play] = useSound("/sounds/achievement.mp3");

  if (isOpen) play();

  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <Style>
        <GridEffect>
          {achievements?.map((achievement: string, index: number) => (
            <article key={index} className="card">
              <div className="card-content">
                <CardStyle className="unlock">
                  {achievementsList[+achievement - 1]?.img}
                  <h4>{achievementsList[+achievement - 1]?.title}</h4>
                  <p>{achievementsList[+achievement - 1]?.desc}</p>
                </CardStyle>
              </div>
            </article>
          ))}
        </GridEffect>
        <button className="lg" onClick={() => setIsOpen(false)}>
          Close 🔥
        </button>
      </Style>
    </Modale>
  );
};
export default Achievement;

const Style = styled.div`
  > div {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 10px;
  }
  > button {
    margin-top: 20px;
    width: 100%;
    background-color: #faff00;
    color: #000;
    border: none;
    padding: 12px 10px;
  }
`;
