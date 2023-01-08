import type { NextPage } from "next";

import Head from "@/layout/Head";
import Navbar from "@/layout/Navbar";
import Avatar from "@/components/Avatar";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head title="Components | Ping Pong Champion" />
      <Navbar />
      <main>
        <h1>heading 1</h1>
        <h2>heading 2</h2>
        <h3>heading 3</h3>
        <h4>heading 4</h4>
        <h5>heading 5</h5>
        <h6>heading 6</h6>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint nisi obcaecati vel rerum
          numquam pariatur fuga officiis molestias repellendus ducimus!
        </p>
        <Link href="/">link</Link>
        <button>button</button>
        <button className="lg">button</button>
        <button className="secondary">button</button>
        <button className="secondary lg">button</button>
        <form action="">
          <label htmlFor="">label</label>
          <input type="text" placeholder="placeholder" />
          <input className="error" type="text" placeholder="placeholder" />
        </form>
        <Avatar src="https://avatars.githubusercontent.com/u/59531847?v=4" size={100} />
      </main>
    </>
  );
};

export default Home;
