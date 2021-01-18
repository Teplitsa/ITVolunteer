import { ReactElement, useEffect } from "react";
import WithGlobalScripts from "../hoc/withGlobalScripts";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import FooterNav from "./partials/FooterNav";
import FooterSectionInfo from "./partials/FooterSectionInfo";
import FooterScripts from "./partials/FooterScripts";
import Stats from "../Stats";
import TeplitsaProjectLinks from "../TeplitsaProjectLinks";
import Socials from "../Socials";
import Copyright from "../Copyright";
import HeaderNav from "./partials/HeaderNav";
import BreadCrumbs from "../../components/BreadCrumbs";

const Main: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <WithGlobalScripts>
      <Header>
        <HeaderNav />
      </Header>
      <BreadCrumbs />
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
      <FooterScripts />
    </WithGlobalScripts>
  );
};

export default Main;
