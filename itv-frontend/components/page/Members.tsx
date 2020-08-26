import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";

const Members: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="members">
      <div className="members__content">
        <div className="members__top">
          <h1 className="members__title">Волонтеры</h1>
        </div>
        <div className="members__list"></div>
      </div>
    </div>
  );
};

export default Members;
