import { ReactElement } from "react";

const Footer: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-inner">{children}</div>
    </footer>
  );
};

export default Footer;
