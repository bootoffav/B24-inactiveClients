import ReactDOMServer from "react-dom/server";
import Result from "../../src/components/Result/Result.tsx";
import React from "react";

const generateBody = (data, type) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"></link>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@creativebulma/bulma-badge@1.0.1/dist/bulma-badge.min.css"></link>
    </head>
    <body>
    <div class="container">
      ${ReactDOMServer.renderToString(
        <Result inActiveEntities={data} type={type} noPagination={true} />
      )}
    </div>
    </body></html>`;
};

export default generateBody;
