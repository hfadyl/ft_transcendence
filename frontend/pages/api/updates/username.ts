import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { jwt } = req.cookies;

  if (req.method === "PUT") {
    await axios
      .put(
        process.env.USERS + "/updateusername",
        { username: req.body.data },
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: `jwt=${jwt}`,
          },
        }
      )
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(error.response.data.statusCode).json({ message: error.response.data.message });
      });
  } else res.status(405).json({ message: "Method not allowed" });
}
