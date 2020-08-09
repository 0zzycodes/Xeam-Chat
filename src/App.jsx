import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { setCurrentUser } from "./redux/user/user.actions";
import { selectCurrentUser } from "./redux/user/user.selectors";
import LoginPage from "./pages/Login/Login";
import RegisterPage from "./pages/Register/Register";
import Chat from "./pages/Chat/Chat";
import "./App.scss";

class App extends React.Component {
  state = {
    isLoading: true,
  };
  unSubscribeFromAuth = null;
  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unSubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }
      setCurrentUser(userAuth);
      this.setState({
        isLoading: false,
      });
    });
  }
  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }
  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <Switch>
            <Route
              exact
              path="/"
              // render={() =>
              //   this.props.currentUser ? (
              //     <LoginPage />
              //   ) : (
              //     <Redirect to="/messaging" />
              //   )
              // }
              component={LoginPage}
            />

            <Route exact path="/register" component={RegisterPage} />
            <Route
              exact
              path="/messaging"
              component={Chat}
              // render={() =>
              //   this.props.currentUser ? <Chat /> : <Redirect to="/" />
              // }
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
