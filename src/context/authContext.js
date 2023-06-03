import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../api/auth";
import Loading from "../components/common/loading/Loading";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoding] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    //로그인 세션이 남아있으면, 해당 user정보를 state에 저장
    setUserData({
      ...JSON.parse(sessionStorage.getItem("userData")),
    });
  }, []);
  console.log(userData);

  //로그인 함수
  const handleLogin = async data => {
    setIsLoding(true);
    const userData = await postLogin(data);
    if (userData) {
      setUserData(userData);
      sessionStorage.setItem("userData", JSON.stringify(userData));
      setIsLoding(false);
      setTimeout(() => navigate("/"), 300);
    }
  };

  //로그아웃 함수
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.replace("/");
  };

  if (isLoading) return <Loading />;

  return (
    <AuthContext.Provider
      value={{ userData, onLogin: handleLogin, onLogout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);