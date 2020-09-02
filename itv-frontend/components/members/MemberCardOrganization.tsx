import { ReactElement, useState } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import OrganizationLogoDefault from "../../assets/img/pic-organization.svg";
import MemberOrganizationDescription from "../MemberOrganizationDescription";

const MemberCardOrganization: React.FunctionComponent = (): ReactElement => {
  const {
    organizationLogo,
    organizationName,
    organizationDescription,
    organizationSite,
  } = useStoreState((state) => state.components.memberAccount);

  return (
    <div className="member-card__organization">
      <div className="member-card__organization-header">
        <div className="member-card__organization-logo">
          <img
            className="member-card__organization-logo-image"
            src={organizationLogo ? organizationLogo : OrganizationLogoDefault}
            alt={organizationName}
          />
        </div>
        <div className="member-card__organization-top">
          <div
            className="member-card__organization-name"
            dangerouslySetInnerHTML={{ __html: organizationName }}
          />
          {organizationSite && (
            <div className="member-card__organization-site">
              <a href={organizationSite} target="_blank">
                {new URL(organizationSite).hostname}
              </a>
            </div>
          )}
        </div>
      </div>
      <MemberOrganizationDescription {...{ organizationDescription }} />
    </div>
  );
};

export default MemberCardOrganization;
