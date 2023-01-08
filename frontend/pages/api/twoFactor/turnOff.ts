import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await fetch(`${process.env.TWO_FACTOR_AUTH}/disable2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${req.cookies.jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        res.status(data.statusCode).json({ message: data.message, statusCode: data.statusCode });
      })
      .catch((err) => {
        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
      });
  } else res.status(405).json({ error: "Method not allowed" });
}
