import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import { MainContent, Paper } from "../components";

import { firebase } from '../lib'

import iconMe from "../images/me.png";

const fbProvider = new firebase.auth.FacebookAuthProvider();
fbProvider.setCustomParameters({
  display: "popup"
});

const Login = ({ history }) => {

  const loginFB = async () => {
    try {
      const result = await firebase.auth().signInWithPopup(fbProvider);
      const user = result.user;
      const userData = {
        email: user.providerData[0].email,
        display_name: user.providerData[0].displayName,
        imageProfile: user.providerData[0].photoURL,
      };
      console.log('userData', userData)
    } catch (error) {
      console.log("Error", { error, code: error.code, message: error.message });
    }
  };

  const handleCancelLogin = () => {
    history.push("/menu");
  };

  return (
    <div className="login-page">
      <div className="container">
        <MainContent>
          <div className="announcement">
            <Paper
              onClose={handleCancelLogin}
              renderHeader={
                <Fragment>
                  <img className="_center" src={iconMe} alt="" />
                  <h1 className="_text-center">Confess your regret</h1>
                </Fragment>
              }
              renderBody={
                <Fragment>
                  <p className="_text-justify _bold">
                    Please log in with Facebook to start sailing your regrets
                    away. You will be able to keep track of your journey while
                    navigating through others regrets
                  </p>
                  <div style={{ width: 200, margin: "30px auto" }}>
                    <button className="button with-addon" onClick={loginFB}>
                      <span className="addon-icon">
                        <i className="fab fa-facebook-f" />
                      </span>
                      <span>Log in with Facebook</span>
                    </button>
                  </div>
                </Fragment>
              }
              renderFooter={
                <h6 className="_text-center _bold">
                  By clicking the button above, you are agreeing to our{" "}
                  <Link to="/terms">
                    <u>Terms and Conditions</u>
                  </Link>
                </h6>
              }
            />
          </div>
        </MainContent>
      </div>
    </div>
  );
};

export default Login;
