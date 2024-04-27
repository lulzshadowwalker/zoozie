"use client";

import { TUser } from "@types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAccessToken, getUser } from "@lib/actions/auth";

type Props = {
  children: ReactNode;
};

type TUserContext = {
  user?: TUser;
  accessToken?: string;
};

const UserContext = createContext<TUserContext | null>(null);

export default function UserContextProvider({ children }: Props) {
  const [user, setUser] = useState<TUser | undefined>();
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(function handleGetUser() {
    getUser().then((payload) => {
      if (payload?.user) {
        setUser(payload.user);
      }
    });
  }, []);

  useEffect(function handleGetAccessToken() {
    getAccessToken().then((token) => {
      setAccessToken(token);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, accessToken }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): TUserContext {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
}
