import styled from "styled-components";

export const Style = styled.section`
  margin-top: 50px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    h1 {
      width: 100%;
    }
    > div {
      display: flex;
      align-items: center;
      gap: 1rem;
      :first-child {
        flex: 1;
      }
      :last-child {
        gap: 0.5rem;
      }
    }
  }
  .swiper-slide {
    width: 275px;
    transform: scale(0.8);
    transform-origin: right;
    transition: transform 0.3s ease, transform-origin 0.3s ease;

    &-active {
      transition: transform 0.5s ease, transform-origin 0.4s ease;
      transform: scale(1);
    }
    &-next,
    &-prev {
      transform: scale(0.9);
      transform-origin: center;
    }
    &-next ~ .swiper-slide {
      transform-origin: left;
    }
    .swiper-button-prev {
      position: static;
    }
  }
`;

export const CardStyle = styled.article`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  h5 {
    white-space: nowrap;
    margin-top: 10px;
  }
  b {
    color: var(--text-300);
  }
  a {
    width: 100%;
    text-align: center;
    color: var(--text-100);
  }
  .top {
    border-radius: 20px;
    overflow: hidden;
    gap: 5px;
    display: flex;
    flex-direction: column;
  }
  .avatars {
    display: flex;
    gap: 5px;
  }
  .map {
    height: 150px;
    background-color: #151515;
  }
`;
