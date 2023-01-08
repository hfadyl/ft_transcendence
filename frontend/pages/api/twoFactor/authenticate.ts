import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await fetch(`${process.env.TWO_FACTOR_AUTH}/authenticate`, {
      method: "POST",
      body: JSON.stringify({ code: req.body }),
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${req.cookies.checkJwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 200)
          res.setHeader("Set-Cookie", [
            `checkJwt=; Path=/; HttpOnly; Max-Age=0`,
            `jwt=${data.jwt}; Path=/; HttpOnly; Max-Age=86400`,
          ]);
        res.status(data.statusCode).json({ message: data.message, statusCode: data.statusCode });
      })
      .catch((err) => {
        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
      });
  } else res.status(405).json({ error: "Method not allowed" });
}
