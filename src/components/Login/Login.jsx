import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { auth, signInWithGoogle } from "../../firebase/firebase.utils";
import FormInput from "../FormInput/FormInput";
import CustomButton from "../CustomButton/CustomButton";
import loader from "../../assets/loader.gif";
import google from "../../assets/google.svg";
import padlock from "../../assets/padlock.svg";
import emailIcon from "../../assets/email.svg";
import home from "../../assets/home.svg";
import "./Login.scss";

export default withRouter(
  class Login extends Component {
    state = {
      email: "",
      password: "",
      errorMessage: "",
      isShowPassword: false,
      isLoading: false,
    };
    handleToggleShowPassword = () =>
      this.setState({ isShowPassword: !this.state.isShowPassword });
    handleSubmit = async (event) => {
      event.preventDefault();
      const { email, password } = this.state;

      try {
        this.setState({ isLoading: true });
        await auth.signInWithEmailAndPassword(email, password);
        this.setState({ email: "", password: "" });
        this.props.history.push("/home");
      } catch (error) {
        error.code === "auth/wrong-password"
          ? this.setState({
              isLoading: false,
              errorMessage:
                "The password is invalid or the user does not have a password.",
            })
          : error.code === "auth/user-not-found"
          ? this.setState({
              isLoading: false,
              errorMessage:
                "There is no user record corresponding to this identifier.",
            })
          : this.setState({ isLoading: false, errorMessage: "Wierd" });
      }

      this.setState({ email: "", password: "" });
    };
    handleChange = (event) => {
      const { name, value } = event.target;
      this.setState({
        [name]: value,
        errorMessage: "",
      });
    };
    render() {
      const {
        email,
        password,
        errorMessage,
        isShowPassword,
        isLoading,
      } = this.state;
      return (
        <div className="sign-in">
          <div>
            <h3 className="title">Welcome Back</h3>
            <span className="sub-titile">Login to continue</span>
            {errorMessage !== "" ? (
              <span className="error">{errorMessage}</span>
            ) : null}
            <form onSubmit={this.handleSubmit}>
              <div className="form-input-group">
                <div className="icon-conatainer">
                  <img className="email-icon" src={emailIcon} alt="email" />
                </div>
                <FormInput
                  type="email"
                  name="email"
                  value={email}
                  required
                  handleChange={this.handleChange}
                  label="Email"
                />
              </div>
              <div className="form-input-group">
                <div className="icon-conatainer">
                  <img className="padlock-icon" src={padlock} alt="padlock" />
                </div>
                <FormInput
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  required
                  handleChange={this.handleChange}
                  label="Password"
                  forgotPassword
                  toggleShowPassword={this.handleToggleShowPassword}
                  isShowPass={this.state.isShowPassword}
                  handleForgetPass={this.props.forgotPassword}
                />
              </div>
              <div className="buttons">
                <CustomButton type="button" onClick={this.handleSubmit}>
                  Sign In {isLoading ? <img src={loader} alt="Loader" /> : null}
                </CustomButton>
              </div>
              <div className="login-google">
                <p className="login-with ">Login with:</p>
                <div className="buttons">
                  <CustomButton onClick={signInWithGoogle} isGoogleSignIn>
                    <img src={google} alt="Google Logo" />
                    Google
                  </CustomButton>
                </div>
              </div>
            </form>
            <p className="no-account">
              {" "}
              Don't have an account?{" "}
              <Link to="/register">
                <span>Register</span>
              </Link>
            </p>
          </div>
        </div>
      );
    }
  }
);
