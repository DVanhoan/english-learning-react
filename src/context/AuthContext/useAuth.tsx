import { useContext } from "react";
import { AuthContext } from "./auth.context";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext error");
  return context;
}
