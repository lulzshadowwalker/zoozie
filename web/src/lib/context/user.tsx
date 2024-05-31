"use client";

import { TUser } from "@types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAccessToken, getUser, getUserClaims } from "@lib/actions/auth";
import { usePostHog } from "posthog-js/react";
import { TUserClaims } from "../auth";

type Props = {
  children: ReactNode;
};

type TUserContext = {
  user: PendingValue<TUser>;
  accessToken: PendingValue<string>;
  claims: PendingValue<TUserClaims>;
  refresh: () => void;
};

type PendingValue<T> = {
  value?: T;
  pending: boolean;
};

const UserContext = createContext<TUserContext | null>(null);

export default function UserContextProvider({ children }: Props) {
  const [user, setUser] = useState<PendingValue<TUser>>({ pending: true });
  const [claims, setClaims] = useState<PendingValue<TUserClaims>>({
    pending: true,
  });
  const [accessToken, setAccessToken] = useState<PendingValue<string>>({
    pending: true,
  });
  const [_refresh, _setRefresh] = useState(false);
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

          setUser({ value: undefined, pending: false });
          posthog.reset();
        })
        .catch((e) => {
          console.error("failed to get user", e);
          posthog.reset();
          return setUser({ pending: false });
        });
    },
    [posthog, _refresh],
  );

  useEffect(
    function handleGetAccessToken() {
      getAccessToken()
        .then((token) => {
          setAccessToken({ value: token, pending: false });
        })
        .catch((e) => {
          console.error("failed to get access token", e);
          return setAccessToken({ pending: false });
        });
    },
    [_refresh],
  );

  useEffect(
    function handleGetUserClaims() {
      getUserClaims()
        .then((claims) => {
          setClaims({ value: claims, pending: false });
        })
        .catch((e) => {
          console.error("failed to get user claims", e);
          return setClaims({ pending: false });
        });
    },
    [_refresh],
  );

  function refresh() {
    _setRefresh((prev) => !prev);
  }
  return (
    <UserContext.Provider value={{ user, claims, accessToken, refresh }}>
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
