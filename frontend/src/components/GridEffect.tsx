import { FC, useRef, useEffect } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const GridEffect: FC<Props> = ({ children }) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentCardsRef = cardsRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const cards = currentCardsRef?.getElementsByClassName("card");
      if (cards) {
        Array.from(cards).forEach((card) => {
          if (card instanceof HTMLElement) {
            const rect = card.getBoundingClientRect(),
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
          }
        });
      }
    };
    currentCardsRef?.addEventListener("mousemove", handleMouseMove);
    return () => {
      currentCardsRef?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <Style ref={cardsRef}>{children}</Style>;
};

export default GridEffect;

const Style = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  @media (max-width: 1270px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }

  :hover > .card::after {
    opacity: 1;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    height: 298px;
    flex-direction: column;
    position: relative;
    min-width: 260px;
    overflow: hidden;
  }

  .card:hover::before {
    opacity: 1;
  }

  .card::before,
  .card::after {
    border-radius: inherit;
    content: "";
    height: 100%;
    left: 0px;
    opacity: 0;
    position: absolute;
    top: 0px;
    transition: opacity 500ms;
    width: 100%;
    pointer-events: none;
    user-select: none;
  }

  .card::before {
    background: radial-gradient(
      800px circle at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.03),
      transparent 40%
    );
    z-index: 3;
  }

  .card::after {
    background: radial-gradient(
      600px circle at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.4),
      transparent 40%
    );
    z-index: 1;
  }

  .card > .card-content {
    background-color: var(--background-200);
    border-radius: inherit;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    inset: 1px;
    padding: 10px;
    position: absolute;
    z-index: 2;
  }
`;
