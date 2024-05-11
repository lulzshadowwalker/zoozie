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
import { usePostHog } from "posthog-js/react";

type Props = {
  children: ReactNode;
};

type TUserContext = {
  user: PendingValue<TUser>;
  accessToken: PendingValue<string>;
};

type PendingValue<T> = {
  value?: T;
  pending: boolean;
};

const UserContext = createContext<TUserContext | null>(null);

export default function UserContextProvider({ children }: Props) {
  const [user, setUser] = useState<PendingValue<TUser>>({ pending: true });
  const [accessToken, setAccessToken] = useState<PendingValue<string>>({
    pending: true,
  });
  const [_refresh, setRefresh] = useState(false);
  const posthog = usePostHog();

  useEffect(
    function handleGetUser() {
      getUser()
        .then((payload) => {
          if (payload?.user) {
            setUser({ value: payload.user, pending: false });
            posthog.identify(payload.user.emailAddress);
            return;
          }

          posthog.reset();
        })
        .catch((e) => {
          console.error("failed to get user", e);
          posthog.reset();
          return setUser({ pending: false });
        });
    },
    [posthog],
  );

  useEffect(function handleGetAccessToken() {
    getAccessToken()
      .then((token) => {
        setAccessToken({ value: token, pending: false });
      })
      .catch((e) => {
        console.error("failed to get access token", e);
        return setAccessToken({ pending: false });
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
