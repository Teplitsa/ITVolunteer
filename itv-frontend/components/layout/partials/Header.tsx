import { ReactElement } from "react";


const Header: React.FunctionComponent = ({ children }): ReactElement => {
  //const user = useStoreState((store) => store.user.data);

  return (
    <header id="site-header" className="site-header">
      {children}
    </header>
  );
};

export default Header;
