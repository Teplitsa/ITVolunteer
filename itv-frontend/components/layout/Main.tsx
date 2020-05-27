import { ReactElement } from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import FooterNav from "./partials/FooterNav";
import FooterSectionInfo from "./partials/FooterSectionInfo";
import Stats from "../Stats";
import TeplitsaProjectLinks from "../TeplitsaProjectLinks";
import Socials from "../Socials";
import Copyright from "../Copyright";
import HeaderNav from "./partials/HeaderNav";

const Main: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <>
      <Header>
        <HeaderNav />
      </Header>
      {children}
      <Footer>
        <FooterNav />
        <FooterSectionInfo>
          <Stats />
          <TeplitsaProjectLinks />
          <Socials />
        </FooterSectionInfo>
        <Copyright />
      </Footer>
    </>
  );
};

export default Main;
