import React, { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";

const MemberCvLink: React.FunctionComponent = (): ReactElement => {
  const cvURL = useStoreState(state => state.components.memberAccount.cvURL);

  if (!cvURL) return null;

  return (
    <div className="member-card__cv">
      <a className="member-card__cv-link" href={cvURL} target="_blank" rel="noreferrer">
        Моё резюме
      </a>
    </div>
  );
};

export default MemberCvLink;
