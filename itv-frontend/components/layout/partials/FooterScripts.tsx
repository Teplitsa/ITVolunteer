import { ReactElement } from "react";
import GlobalScripts from "../../../context/global-scripts";
import Modal from "../../global-scripts/Modal";
import SnackbarList from "../../global-scripts/SnackbarList";

const { ModalContext, SnackbarContext } = GlobalScripts;

const FooterScripts: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <ModalContext.Consumer>{props => <Modal {...props} />}</ModalContext.Consumer>
      <SnackbarContext.Consumer>{props => <SnackbarList {...props} />}</SnackbarContext.Consumer>
    </>
  );
};

export default FooterScripts;
