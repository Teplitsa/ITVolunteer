import { ReactElement, useState, useEffect } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import MemberOrganizationDescription from "../MemberOrganizationDescription";
import { isLinkValid } from "../../utilities/utilities";

const MemberCardOrganization: React.FunctionComponent = (): ReactElement => {
  const {
    organizationLogo,
    organizationName,
    organizationDescription,
    organizationSite,
  } = useStoreState((state) => state.components.memberAccount);

  const [isOrganizationLogoValid, setOrganizationLogoValid] = useState<boolean>(
    false
  );

  useEffect(() => {
    try {
      organizationLogo &&
        fetch(organizationLogo, { mode: "no-cors" }).then((response) =>
          setOrganizationLogoValid(response.ok)
        );
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="member-card__organization">
      <div className="member-card__organization-header">
        <div className="member-card__organization-logo">
          {isOrganizationLogoValid && (
            <img
              className="member-card__organization-logo-image"
              src={organizationLogo}
              alt={organizationName}
            />
          )}
        </div>
        <div className="member-card__organization-top">
          <div
            className="member-card__organization-name"
            dangerouslySetInnerHTML={{ __html: organizationName }}
          />
          {isLinkValid(organizationSite) && (
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
