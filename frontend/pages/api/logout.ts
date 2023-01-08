import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      Object.keys(req.cookies).map((key) => `${key}=; Path=/; Max-Age=0`)
    );
    res.status(200).json({ message: "OK" });
  } else res.status(405).json({ error: "Method not allowed" });
};
export default handler;
