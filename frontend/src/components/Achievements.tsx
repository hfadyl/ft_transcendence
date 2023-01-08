import { FC } from "react";
import GridEffect from "@/components/GridEffect";
import styled from "styled-components";
import { achievementsList } from "@/src/achievements";

interface Props {
  achievements: string[];
}

const Achievements: FC<Props> = ({ achievements }) => {
  return (
    <section>
      <h3>
        Achievements <span>{achievements?.length}</span>/9
      </h3>
      <GridEffect>
        {achievementsList?.map((achievement, index) => (
          <article key={index} className="card">
            <div className="card-content">
              <CardStyle
                className={`${achievements.includes((index + 1).toString()) ? "unlock" : ""}`}
              >
                {achievement.img}
                <h4>{achievement.title}</h4>
                <p>{achievement.desc}</p>
              </CardStyle>
            </div>
          </article>
        ))}
      </GridEffect>
    </section>
  );
};

export default Achievements;

export const CardStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  h4 {
    margin-top: 25px;
    margin-bottom: 0;
    text-transform: uppercase;
  }
  p {
    color: var(--text-300);
    max-width: 240px;
    margin-top: 5px;
  }

  > * {
    opacity: 0.5;
  }
  svg {
    mix-blend-mode: luminosity;
  }
  &.unlock {
    > * {
      opacity: 1;
    }
    svg {
      mix-blend-mode: normal;
    }
  }
`;
