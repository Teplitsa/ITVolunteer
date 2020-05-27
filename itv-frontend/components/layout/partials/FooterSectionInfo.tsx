import { ReactElement } from "react";

const FooterSectionInfo: React.FunctionComponent = ({
  children,
}): ReactElement => {
  return <div className="info">{children}</div>;
};

export default FooterSectionInfo;
