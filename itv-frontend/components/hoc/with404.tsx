import { ReactElement } from "react";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Error404 from "../../components/page/Error404";

const with404 = (Component: React.FunctionComponent): React.FunctionComponent => {
  const PageWith404: React.FunctionComponent<{ statusCode: number }> = ({
    statusCode,
    ...props
  }): ReactElement => {
    if (statusCode === 404) {
      return (
        <>
          <DocumentHead />
          <Main>
            <Error404 />
          </Main>
        </>
      );
    }

    return <Component {...props} />;
  };

  return PageWith404;
};

export default with404;
