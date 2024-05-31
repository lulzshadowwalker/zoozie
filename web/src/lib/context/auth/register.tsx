"use client";

import { TPhoneNumber } from "@types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type TAuthContext = {
  phoneNumber: TPhoneNumber;
  setPhoneNumber: Dispatch<SetStateAction<TPhoneNumber>>;
};

const AuthContext = createContext<TAuthContext | null>(null);

export default function AuthContextProvider({ children }: Props) {
  const [phoneNumber, setPhoneNumber] = useState<TPhoneNumber>({
    countryCode: "962",
    phoneNumber: "",
  });

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): TAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  return context;
}
