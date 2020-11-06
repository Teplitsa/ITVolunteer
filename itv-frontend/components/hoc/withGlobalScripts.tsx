import { ReactElement, useReducer } from "react";
import GlobalScripts, {
  IModal,
  ISnackbar,
  modalInitialState,
  snackbarInitialState,
} from "../../context/global-scripts";

const { ModalContext, SnackbarContext } = GlobalScripts;

const modalReducer = (state: IModal, action: { type: string; payload: IModal }): IModal => {
  switch (action.type) {
    case "open":
      return { ...state, ...{ isShown: true } };
    case "close":
      return { ...state, ...{ title: "", content: null, isShown: false } };
    case "template":
      return {
        ...state,
        ...{ title: action.payload.title, content: action.payload.content },
      };
    default:
      throw new Error(`Неизвестное действие '${action.type}' модуля Modal.`);
  }
};

const snackbarReducer = (
  state: ISnackbar,
  action: { type: string; payload: ISnackbar }
): ISnackbar => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        ...{
          messages: state.messages.concat(
            action.payload.messages.filter(message => {
              return !state.messages.find(
                storedMessage =>
                  storedMessage.text.trim().toLocaleLowerCase() ===
                  message.text.trim().toLocaleLowerCase()
              );
            })
          ),
        },
      };
    case "delete":
      return {
        ...state,
        ...{
          messages: state.messages.filter(message => !action.payload.messages.includes(message)),
        },
      };
    case "clear":
      return {
        ...state,
        ...{
          messages: [],
        },
      };
    default:
      throw new Error(`Неизвестное действие '${action.type}' модуля  Snackbar.`);
  }
};

const withGlobalScripts: React.FunctionComponent = ({ children }): ReactElement => {
  const [modalState, modalDispatch] = useReducer(modalReducer, modalInitialState);
  const [snackbarState, snackbarDispatch] = useReducer(snackbarReducer, snackbarInitialState);

  return (
    <>
      <SnackbarContext.Provider
        value={Object.assign(snackbarState, {
          dispatch: snackbarDispatch,
        })}
      >
        <ModalContext.Provider
          value={Object.assign(modalState, {
            dispatch: modalDispatch,
          })}
        >
          {children}
        </ModalContext.Provider>
      </SnackbarContext.Provider>
    </>
  );
};

export default withGlobalScripts;
