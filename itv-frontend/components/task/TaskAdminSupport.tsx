import { ReactElement } from "react";
import GlobalScripts, { ISnackbarMessage } from "../../context/global-scripts";
import TaskAdminSupportForm from "./TaskAdminSupportForm";

const { ModalContext, SnackbarContext } = GlobalScripts;

const ModalContent: React.FunctionComponent<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  return (
    <SnackbarContext.Consumer>
      {({ dispatch }) => {
        const addSnackbar = (message: ISnackbarMessage) => {
          dispatch({ type: "add", payload: { messages: [message] } });
        };
        return <TaskAdminSupportForm {...{ closeModal, addSnackbar }} />;
      }}
    </SnackbarContext.Consumer>
  );
};

const TaskAdminSupport: React.FunctionComponent<{
  buttonTitle?: string,
}> = ({buttonTitle}): ReactElement => {
  return (
    <div className="something-wrong-with-task">
      <ModalContext.Consumer>
        {({ dispatch }) => (
          <a
            href="#"
            className="btn btn_alternate btn_full-width"
            onClick={(event) => {
              event.preventDefault();
              dispatch({
                type: "template",
                payload: {
                  title: "Сообщение администратору",
                  content: ModalContent,
                },
              });
              dispatch({ type: "open" });
            }}
          >
            {buttonTitle}
          </a>
        )}
      </ModalContext.Consumer>
    </div>
  );
};

export default TaskAdminSupport;
