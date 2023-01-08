import styled from "styled-components";
import Link from "next/link";
import { Home as HomeIcon } from "react-iconly";
import { PageWithNoLayout } from "@/pages/login";

import Head from "@/layout/Head";
import _404 from "@/images/backgrounds/404.svg";

const Home: PageWithNoLayout = () => {
  return (
    <>
      <Head title="Page not found | Ping Pong Champion" />
      <Style>
        <_404 />
        <h1>Ops! Page not found</h1>
        <Link href="/" className="btn lg">
          <HomeIcon set="bulk" />
          <span>Go back home</span>
        </Link>
      </Style>
    </>
  );
};

export default Home;

Home.noLayout = true;

const Style = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
`;
