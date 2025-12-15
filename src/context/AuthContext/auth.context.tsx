import { createContext, useReducer, type Dispatch } from "react";
import { initAuthState, type AuthState } from "./auth.state";
import { authReducer } from "./auth.reducer";
import { signIn, signOut, type AuthPayloadAction } from "./auth.action";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/api/users.api";
import { getAccessTokenLocalStorage } from "@/utils/token";
import LogoLoader from "@/components/LogoLoader";

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthPayloadAction>;
}

const initAuthContext = {
  state: initAuthState,
  dispatch: () => null,
};

export const AuthContext = createContext<AuthContextType>(initAuthContext);
export let externalDispatch: Dispatch<AuthPayloadAction> = () => null;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(authReducer, initAuthState);
  const accessToken = getAccessTokenLocalStorage();
  externalDispatch = dispatch;

  const { isPending } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () =>
      UserApi.getProfile()
        .then((response) => {
          dispatch(signIn({ isAuthenticated: true, user: response.data }));
          return response;
        })
        .catch(() => {
          dispatch(signOut());
        }),
    enabled: Boolean(accessToken),
  });

  // const isHydrating =
  //   Boolean(accessToken) && !state.isAuthenticated && isPending;
  // if (isHydrating) return <LogoLoader />;

  return (
    <>
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
