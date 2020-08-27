import { ReactElement, useState, useEffect, useRef } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import GlobalScripts, { ISnackbarMessage } from "../../context/global-scripts";
import TaskAdminSupportForm from "../task/TaskAdminSupportForm";

const { ModalContext, SnackbarContext } = GlobalScripts;

const PageContacts: React.FunctionComponent = (): ReactElement => {
  const { title, content } = useStoreState((state) => state.components.page);
  const [isShowForm, setIsShowForm] = useState(true);

  function handleSuccess() {
    setIsShowForm(false);
  }

  return (
    <article className="article article-page">
      <div className="article__content article-page__content">
        <h1
          className="article__title article-page__title"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div
          className="article__content-text article-page__content-text"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
        <div className={`contact-form-wrapper ${!isShowForm && "disabled"}`}>
          <ContactFormContent handleSuccess={handleSuccess} />
        </div>
      </div>
    </article>
  );
};

const ContactFormContent: React.FunctionComponent<{handleSuccess:() => void}> = ({handleSuccess}) => {
  return (
    <SnackbarContext.Consumer>
      {({ dispatch }) => {
        const addSnackbar = (message: ISnackbarMessage) => {
          dispatch({ type: "add", payload: { messages: [message] } });
          if(message.context == "success") {
            handleSuccess();
          }
        };
        return <TaskAdminSupportForm {...{ closeModal: () => {}, addSnackbar }} />;
      }}
    </SnackbarContext.Consumer>
  );
};

export default PageContacts;
