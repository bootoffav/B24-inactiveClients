import React from "react";
import ReactDOM from "react-dom";
import "bulma";
import netlifyIdentity from "netlify-identity-widget";
import "./styles.scss";
import App from "./App";

// netlifyIdentity.init();

// netlifyIdentity.on("login", () => {
//   netlifyIdentity.close();
//   ReactDOM.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>,
//     document.getElementById("root")
//   );
// });

// netlifyIdentity.currentUser()
// ?
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
// : netlifyIdentity.open();
