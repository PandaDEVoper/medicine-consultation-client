import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./app";

ReactDom.render(<Router forceRefresh={true}><App /></Router>, document.getElementById("root"));
