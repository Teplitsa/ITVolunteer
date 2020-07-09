import { createContext, Dispatch } from "react";

export interface IModal {
  isShown?: boolean;
  title?: string;
  content?: React.FunctionComponent<{ closeModal: () => void }>;
  dispatch?: Dispatch<{
    type: string;
    payload?: IModal;
  }>;
}

export interface ISnackbarMessage {
  context: "success" | "error";
  text: string;
}

export interface ISnackbar {
  messages: Array<ISnackbarMessage>;
  dispatch?: Dispatch<{
    type: string;
    payload?: ISnackbar;
  }>;
}

export const modalInitialState: IModal = {
  isShown: false,
  title: "",
  content: null,
};

const ModalContext = createContext(modalInitialState);

ModalContext.displayName = "modalContext";

export const snackbarInitialState: ISnackbar = {
  messages: [],
};

const SnackbarContext = createContext(snackbarInitialState);

SnackbarContext.displayName = "snackbarContext";

export default { ModalContext, SnackbarContext };
