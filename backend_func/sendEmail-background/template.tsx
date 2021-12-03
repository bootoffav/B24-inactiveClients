import Result from "../../../src/components/Result/Result";
import React from "react";
import ReactDOMServer from "react-dom/server";

const generateHtml = (data) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"></link>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@creativebulma/bulma-badge@1.0.1/dist/bulma-badge.min.css"></link>
    </head>
    <body>
    bla bla
    </body></html>`;
};
// ${ReactDOMServer.renderToString(<Result inActiveData={data}></Result>)}

export default generateHtml;
