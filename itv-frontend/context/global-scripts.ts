import { createContext, Dispatch } from "react";

export interface IModal {
  isShown?: boolean;
  hideBackdrop?: boolean;
  hAlign?: "left" | "center" | "right";
  title?: string;
  header?: React.FunctionComponent<{ closeModal: () => void }>;
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

export interface IScreenLoader {
  isShown?: boolean;
  title?: string;
  dispatch?: Dispatch<{
    type: string;
    payload?: IScreenLoader;
  }>;
}

export const modalInitialState: IModal = {
  isShown: false,
  hideBackdrop: false,
  hAlign: "center",
  title: "",
  header: null,
  content: null,
};

const ModalContext = createContext(modalInitialState);

ModalContext.displayName = "modalContext";

export const snackbarInitialState: ISnackbar = {
  messages: [],
};

const SnackbarContext = createContext(snackbarInitialState);

SnackbarContext.displayName = "snackbarContext";

export const screenLoaderInitialState: IScreenLoader = {
  isShown: false,
  title: "",
};

const ScreenLoaderContext = createContext(screenLoaderInitialState);

ScreenLoaderContext.displayName = "screenLoaderContext";

export default { ModalContext, SnackbarContext, ScreenLoaderContext };
