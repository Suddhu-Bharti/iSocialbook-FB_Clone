import { LoginFailure, LoginStart, LoginSuccess, Logout } from "./context/AuthActions";
import axios from "axios";

export const loginCall = async (user, dispatch) => {
  dispatch(LoginStart());
  try {
    const res = await axios.post("/auth/login/", user);
    dispatch(LoginSuccess(res.data));
    localStorage.setItem("user", JSON.stringify(res.data));
  } catch (err) {
    console.log(err);
    dispatch(LoginFailure(true));
  }
};

export const registerCall = async (user, dispatch) => {
  dispatch(LoginStart());
  try {
    const res = await axios.post("/auth/register/", user);
    dispatch(LoginSuccess(res.data));
    localStorage.setItem("user", JSON.stringify(res.data));
  } catch (err) {
    console.log(err);
    dispatch(LoginFailure(true));
  }
};
export const logout = async (dispatch) => {
    localStorage.removeItem("user");
    dispatch(Logout());
};
