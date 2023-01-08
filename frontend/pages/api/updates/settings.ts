import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jwt } = req.cookies;
  const { field, value } = req.body;

  let route = "";
  if (field === "username") route = "/updateUsername";
  else if (field === "email") route = "/updateEmail";
  else if (field === "fullName") route = "/updatefullName";
  else if (field === "phoneNumber") route = "/updatePhoneNumber";
  else if (field === "country") route = "/updateCountry";

  if (req.method === "PUT" && field && value) {
    await axios
      .put(
        process.env.USERS + route,
        { [field]: value },
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
  } else res.status(405).json({ error: "Method not allowed" });
}
