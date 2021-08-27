import React from "react";
import "./App.scss";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Auth from "./components/Auth/Auth";

function App() {
  return (
    <Router>
      <div className="container no-footer-content">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/auth" exact component={Auth} />
        </Switch>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
