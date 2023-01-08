import { useState } from "react";
import { Login } from "react-iconly";
import { useRouter } from "next/router";
import { PageWithNoLayout } from "@/pages/login";

import Head from "@/layout/Head";
import { Style } from "@/pages/login/username";

import Logo from "@/images/brand/brand.svg";

const QRCodeLogin: PageWithNoLayout = () => {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("Invalid code");
      return;
    }
    await fetch("/api/twoFactor/authenticate", {
      method: "POST",
      body: code,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.statusCode === 200) router.push("/").then(() => window.location.reload());
        else setError(data.message);
      })
      .catch((err) => setError(err.message));
  };
  return (
    <>
      <Head title="two factor Authentication | Ping Pong Champion" />
      <Style>
        <div>
          <header>
            <Logo />
          </header>

          <form onSubmit={handleSubmit}>
            <label htmlFor="qrcode">Code:</label>
            <input
              className={error ? "error" : ""}
              type="text"
              value={code}
              id="qrcode"
              placeholder="Enter recieved code"
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="lg">
              <span>confirme</span>
              <Login set="bulk" />
            </button>
          </form>
        </div>
      </Style>
    </>
  );
};
export default QRCodeLogin;

QRCodeLogin.noLayout = true;
