import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasToken, clearToken } from "./api";

export function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasToken()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return {
    isAuth: hasToken(),
    logout: () => {
      clearToken();
      navigate("/login", { replace: true });
    },
  };
}
