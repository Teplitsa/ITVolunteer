import { ReactElement } from "react";
import Link from "next/link";
import Logo from "../../../assets/img/pic-logo-itv.svg";

const SkeletonHeader: React.FunctionComponent = (): ReactElement => {
  return (
    <header className="skeleton-header">
      <div className="skeleton-header__inner">
        <Link href="/">
          <a className="skeleton-header__logo">
            <img src={Logo} className="logo" alt="IT-волонтер" />
          </a>
        </Link>
        <div className="skeleton-header__nav">
          <div className="skeleton-header__item-mock" />
          <div className="skeleton-header__item-mock" />
          <div className="skeleton-header__item-mock" />
        </div>
        <div className="skeleton-header__user-nav">
          <div className="skeleton-header__item-mock" />
          <div className="skeleton-header__item-mock" />
        </div>
        <div className="skeleton-header__toggle-btn" />
      </div>
    </header>
  );
};

export default SkeletonHeader;
