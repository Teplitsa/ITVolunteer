import { ReactElement, useReducer } from "react";
import GlobalScripts, {
  IModal,
  ISnackbar,
  IScreenLoader,
  modalInitialState,
  snackbarInitialState,
  screenLoaderInitialState,
} from "../../context/global-scripts";

const { ModalContext, SnackbarContext, ScreenLoaderContext } = GlobalScripts;

const modalReducer = (state: IModal, action: { type: string; payload: IModal }): IModal => {
  switch (action.type) {
  case "open":
    return { ...state, ...{ isShown: true } };
  case "close":
    return { ...state, ...modalInitialState };
  case "template":
    return {
      ...state,
      ...{
        hideBackdrop: action.payload.hideBackdrop,
        hAlign: action.payload.hAlign,
        title: action.payload.title,
        header: action.payload.header,
        content: action.payload.content,
      },
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

const screenLoaderReducer = (
  state: IScreenLoader,
  action: { type: string; payload: IScreenLoader }
): IScreenLoader => {
  switch (action.type) {
  case "open":
    return { ...state, ...{ isShown: true } };
  case "close":
    return { ...state, ...screenLoaderInitialState };
  default:
    throw new Error(`Неизвестное действие '${action.type}' модуля ScreenLoader.`);
  }
};

const withGlobalScripts: React.FunctionComponent = ({ children }): ReactElement => {
  const [modalState, modalDispatch] = useReducer(modalReducer, modalInitialState);
  const [snackbarState, snackbarDispatch] = useReducer(snackbarReducer, snackbarInitialState);
  const [screenLoaderState, screenLoaderDispatch] = useReducer(
    screenLoaderReducer,
    screenLoaderInitialState
  );

  return (
    <>
      <ScreenLoaderContext.Provider
        value={Object.assign(screenLoaderState, {
          dispatch: screenLoaderDispatch,
        })}
      >
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
      </ScreenLoaderContext.Provider>
    </>
  );
};

export default withGlobalScripts;
