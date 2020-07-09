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

const TaskAdminSupport: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="something-wrong-with-task">
      <ModalContext.Consumer>
        {({ dispatch }) => (
          <a
            href="#"
            className="contact-admin"
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
            Что-то не так с задачей? Напишите администратору
          </a>
        )}
      </ModalContext.Consumer>
    </div>
  );
};

export default TaskAdminSupport;
