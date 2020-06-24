import { ReactElement } from "react";

const Sidebar: React.FunctionComponent = ({ children }): ReactElement => {
  return <section className="sidebar">{children}</section>;
};

export default Sidebar;
