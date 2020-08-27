import { ReactElement, useState } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import OrganizationLogoDefault from "../../assets/img/pic-organization.svg";

const MemberCardOrganization: React.FunctionComponent = (): ReactElement => {
  const [isFullDescription, setFullDescription] = useState<boolean>(false);
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
          <div className="member-card__organization-name">
            {organizationName}
          </div>
          {organizationSite && (
            <div className="member-card__organization-site">
              <a href={organizationSite} target="_blank">
                {new URL(organizationSite).hostname}
              </a>
            </div>
          )}
        </div>
      </div>
      {organizationDescription && (
        <div className="member-card__organization-description">
          {(isFullDescription && organizationDescription) ||
            `${organizationDescription.trim().substr(0, 109)}…`}{" "}
          {organizationDescription.trim().length > 109 && !isFullDescription && (
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setFullDescription(true);
              }}
            >
              Подробнее
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberCardOrganization;
