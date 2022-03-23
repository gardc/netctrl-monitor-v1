import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import MainView from "./Pages/MainView";
import LoginPage from "./Pages/Login";
import store from "./redux/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="main/*" element={<MainView />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
