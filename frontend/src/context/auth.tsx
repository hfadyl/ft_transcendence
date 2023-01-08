import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface UserType {
  id: string;
  avatar: string;
  losses: number;
  wins: number;
  country: string | null;
  email: string;
  fullName: string;
  username: string;
  score: number;
  twoFactor: boolean;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
}

export interface authContextType {
  user: UserType | null;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setAvatar: (avatar: string) => void;
  setUsername: (username: string) => void;
}

const AuthContext = createContext<authContextType>({
  user: null,
  logout: () => {},
  setUser: () => {},
  setAvatar: (avatar: string) => {},
  setUsername: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  const logout = useCallback(async () => {
    await fetch("/api/logout", {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.message === "OK") {
          setUser(null);
          router.push("/login");
        }
      });
  }, [router]);

  const setAvatar = useCallback((avatar: string) => {
    setUser((prev) => {
      if (prev)
        return {
          ...prev,
          avatar,
        };
      return null;
    });
  }, []);

  const setUsername = useCallback((username: string) => {
    setUser((prev) => {
      if (prev)
        return {
          ...prev,
          username,
        };
      return null;
    });
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        await axios
          .get(`${process.env.USERS}/me`, {
            withCredentials: true,
          })
          .then(({ data }) => {
            if (data) setUser(data);
          })
          .catch((err) => {
            if (err.response.data.statusCode === 401) logout();
          });
      } catch (err) {
        logout();
      }
    };
    getUserData();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, logout, setUser, setAvatar, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
