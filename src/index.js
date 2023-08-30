import "dotenv/config";
import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./styles/tailwind.scss";
import store from "./store/appStore.js";
import App from "./App";
import { ToastProvider } from "react-toast-notifications";
import { ToastContainer } from "./components/UpdateService.jsx";

ReactDOM.render(
  <Provider store={store}>
    <ToastProvider
      components={{ ToastContainer }}
      autoDismiss
      autoDismissTimeout={6000}
      placement="top-right"
    >
      <App />
    </ToastProvider>
  </Provider>,
  document.getElementById("root"),
);
