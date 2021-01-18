import { ReactElement, Fragment } from "react";
import Link from "next/link";
import { useStoreState } from "../model/helpers/hooks";

import iconHome from "../assets/img/icon-home.svg";
import separator from "../assets/img/breadcrumbs-separator.svg";

const BreadCrumbs: React.FunctionComponent = (): ReactElement => {
  const crumbs = useStoreState(state => state.components.breadCrumbs.crumbs);

  if(!crumbs) {
    return null;
  }

  if(!crumbs.length) {
    return null;
  }

  return (
    <section className="breadcrumbs">
      <Link href="/">
        <a>
          <img src={iconHome} />
        </a>
      </Link>
      {crumbs.map((crumb, index) => {
        return (
          <Fragment key={`crumb${index}`}>
            <img className="breadcrumbs__separator" src={separator} />
            {crumb.url 
              ? <Link href={crumb.url}>
                <a>{crumb.title}</a>
              </Link>
              : <span>{crumb.title}</span>
            }
          </Fragment>
        );
      })}
    </section>
  );
};

export default BreadCrumbs;
