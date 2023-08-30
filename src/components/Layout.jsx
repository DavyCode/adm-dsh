import React from "react";
import AppNavBar from "./Navbar.jsx";
import AppHeader from "./Header.jsx";
import { Layout } from "antd";

function AppLayout(props) {
  return (
    <Layout style={{ overflow: "hidden" }}>
      <AppNavBar user={props.user} />
      <Layout style={{ marginLeft: 200, overflow: "hidden" }}>
        <AppHeader />
        <Layout>{props.children}</Layout>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
