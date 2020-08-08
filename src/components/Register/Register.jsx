import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  auth,
  signInWithGoogle,
  createUserProfileDocument,
} from "../../firebase/firebase.utils";
import FormInput from "../FormInput/FormInput";
import CustomButton from "../CustomButton/CustomButton";

import loader from "../../assets/loader.gif";
import google from "../../assets/google.svg";
import padlock from "../../assets/padlock.svg";
import nameIcon from "../../assets/name.svg";
import emailIcon from "../../assets/email.svg";

import "./Register.scss";

export default withRouter(
  class Register extends Component {
    state = {
      displayName: "",
      email: "",
      password: "",
      isShowPassword: false,
      confirmPassword: "",
      errorMessage: "",
      isLoading: false,
    };
    handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value, errorMessage: "" });
    };
    handleToggleShowPassword = () =>
      this.setState({ isShowPassword: !this.state.isShowPassword });
    handleSubmit = async (e) => {
      e.preventDefault();
      const { displayName, email, password, confirmPassword } = this.state;
      if (password !== confirmPassword) {
        this.setState({
          errorMessage: `Password did not match!`,
        });
        return;
      }
      const actionCodeSettings = {
        url: "https://www.example.com/finishSignUp?cartId=1234",
        handleCodeInApp: true,
        iOS: {
          bundleId: "com.example.ios",
        },
        android: {
          packageName: "com.example.android",
          installApp: true,
          minimumVersion: "12",
        },
        dynamicLinkDomain: "example.page.link",
      };

      try {
        this.setState({ isLoading: true });
        const { user } = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        await createUserProfileDocument(user, { displayName });
        await auth.sendSignInLinkToEmail(email, actionCodeSettings);
        this.setState({ isLoading: false, isSuccess: true });
      } catch (error) {
        error.code === "auth/email-already-in-use"
          ? this.setState({
              isLoading: false,
              errorMessage:
                "The email address is already in use by another account",
            })
          : error.code === "auth/weak-password"
          ? this.setState({
              isLoading: false,
              errorMessage: "Password should be at least 6 characters",
            })
          : this.setState({ isLoading: false, errorMessage: "Wierd" });
      }
      this.setState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    };
    render() {
      const {
        displayName,
        email,
        password,
        confirmPassword,
        isShowPassword,
        errorMessage,
        isLoading,
      } = this.state;
      return (
        <div className="sign-up">
          <h3 className="title">Join Us</h3>
          <span className="sub-titile">Register Now</span>
          {errorMessage !== "" ? (
            <span className="error">{errorMessage}</span>
          ) : null}
          <form onSubmit={this.handleSubmit}>
            <div className="form-input-group">
              <div className="icon-conatainer">
                <img className="padlock-icon" src={nameIcon} alt="padlock" />
              </div>
              <FormInput
                type="text"
                name="displayName"
                value={displayName}
                label="Full name"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-input-group">
              <div className="icon-conatainer">
                <img className="padlock-icon" src={emailIcon} alt="padlock" />
              </div>
              <FormInput
                type="email"
                name="email"
                value={email}
                label="Email"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-input-group">
              <div className="icon-conatainer">
                <img className="email-icon" src={padlock} alt="email" />
              </div>
              <FormInput
                type={isShowPassword ? "text" : "password"}
                name="password"
                value={password}
                label="Password"
                onChange={this.handleChange}
                toggleShowPassword={this.handleToggleShowPassword}
                isShowPass={this.state.isShowPassword}
              />
            </div>
            <div className="form-input-group">
              <div className="icon-conatainer">
                <img className="email-icon" src={padlock} alt="email" />
              </div>
              <FormInput
                type={isShowPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                label="Confirm password"
                onChange={this.handleChange}
                toggleShowPassword={this.handleToggleShowPassword}
                isShowPass={this.state.isShowPassword}
              />
            </div>
            <div className="buttons">
              <CustomButton type="submit">
                Create Account{" "}
                {isLoading ? <img src={loader} alt="Loader" /> : null}
              </CustomButton>
            </div>
            <div className="login-google">
              <p className="login-with ">Login with:</p>
              <div className="buttons">
                <CustomButton onClick={signInWithGoogle} isGoogleSignIn>
                  <img src={google} alt="Google Logo" /> Google
                </CustomButton>
              </div>
            </div>
          </form>
          <p className="no-account">
            {" "}
            Already have an account?{" "}
            <Link to="/">
              <span>Login</span>
            </Link>
          </p>
        </div>
      );
    }
  }
);
