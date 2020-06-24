import { ReactElement } from "react";
import GetInitialProps from "next";
import ErrorPage from "next/error";
import { ITaskListModel } from "../model/model.typing";

function Error({ statusCode }) {

  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode, ...{
    app: {
      componentsLoaded: [],
    },
    entrypointType: null,
    entrypoint: { archive: null, page: null },
  } }
}

export default Error