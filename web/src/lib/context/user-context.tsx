"use client";

import { TUser } from "@types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUser } from "@lib/actions/auth";

type Props = {
  children: ReactNode;
};

type UserContextType = {
  user?: TUser;
};

const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({ children }: Props) {
  const [user, setUser] = useState<TUser | undefined>();

  useEffect(function handleGetUser() {
    getUser().then((payload) => {
      if (payload?.user) {
        setUser(payload.user);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
}
