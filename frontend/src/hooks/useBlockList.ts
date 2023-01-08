import { useState, useEffect } from "react";

export const useBlockList = () => {
  const [blockList, setBlockList] = useState<string[] | null>(null);

  const getBlockList = async () => {
    const res = await fetch(`${process.env.USERS}/getblockedUsers`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data) setBlockList(data.map((user: any) => user.login));
  };
  useEffect(() => {
    getBlockList();
  }, []);

  return blockList;
};
