import { Link } from "react-router-dom";
import "./register.css";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { registerCall } from "../../apiCalls";
import CircularProgress from "@mui/material/CircularProgress";

const Register = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const cpassword = useRef();
  const [valid, setValid] = useState(true);

  const { dispatch, error, isFetching } = useContext(AuthContext);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password.current.value === cpassword.current.value) {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      dispatch(registerCall(user, dispatch));
    } else {
      setValid(false);
      // cpassword.current.setCustomValidity("Password mismatch!"); // not properly work
    }
  };
  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">iSocialbook</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on iSocialbook.
          </span>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <form onSubmit={handleRegister} className="registerForm">
              <input
                type="text"
                className="registerInput"
                placeholder="Full Name"
                ref={username}
                required
              />
              <input
                type="email"
                className="registerInput"
                placeholder="Email"
                ref={email}
                required
              />
              <input
                type="password"
                className="registerInput"
                placeholder="Password"
                ref={password}
                minLength="6"
                required
              />
              <input
                type="password"
                className="registerInput"
                placeholder="Confirm password"
                ref={cpassword}
                required
              />
              <button className="registerButton">
                {isFetching ? (
                  <CircularProgress color="inherit" size="25px" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <Link to="/login" className="link">
              <button className="registerLoginButton">Have a Account</button>
            </Link>
            {error && (
              <span
                style={{ color: "red", textAlign: "center", fontSize: "15px" }}
              >
                Something went wrong. Try again later!
              </span>
            )}
            {!valid && (
              <span
                style={{ color: "red", textAlign: "center", fontSize: "15px" }}
              >
                Password mismatch. Try again!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
