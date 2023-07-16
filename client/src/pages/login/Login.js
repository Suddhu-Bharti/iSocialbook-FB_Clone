import { useContext, useRef } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import { loginCall } from "../../apiCalls";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

const Login = () => {
  const email = useRef();
  const password = useRef();
  const { dispatch, isFetching, error } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log({email: email.current.value, password: password.current.value});
    dispatch(
      loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      )
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">iSocialbook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on iSocialbook.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <form onSubmit={handleSubmit} className="loginForm">
              <input
                type="email"
                className="loginInput"
                placeholder="Email"
                ref={email}
                required
              />
              <input
                type="password"
                className="loginInput"
                placeholder="Password"
                ref={password}
                required
              />
              <button disabled={isFetching} className="loginButton">
                {isFetching ? (
                  <CircularProgress color="inherit" size="25px" />
                ) : (
                  "Log In"
                )}
              </button>
            </form>
            <span className="loginForgot">Forgot Password?</span>
            <Link to="/register" className="link">
              <button className="loginRegisterButton">
                Create a New Account
              </button>
            </Link>
            { error && <span style={{color: "red", textAlign: "center", fontSize: "15px"}}>Invalid Credentials</span> }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
