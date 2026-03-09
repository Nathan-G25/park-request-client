import React, { createContext, useContext, useReducer } from "react";
import type { AuthAction, AuthState } from "../types";
import { authReducer } from "../reducers/authreducer";

const intialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem("user");
  const initialData = storedUser
    ? { isAuthenticated: true, user: JSON.parse(storedUser) }
    : intialState;

  const [state, dispatch] = useReducer(authReducer, initialData);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
