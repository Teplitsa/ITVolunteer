import { ReactElement, useState, useEffect } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import MemberOrganizationDescription from "../MemberOrganizationDescription";
import OrganizationLogoDefault from "../../assets/img/icon-briefcase.svg";
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
    const abortController = new AbortController();

    try {
      organizationLogo &&
        fetch(organizationLogo, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then((response) => setOrganizationLogoValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

  return (
    <div className="member-card__organization">
      <div className="member-card__organization-header">
        <div className="member-card__organization-logo">
          <img
            className={`member-card__organization-logo-image ${
              isOrganizationLogoValid
                ? ""
                : "member-card__organization-logo-image_default"
            }`}
            src={
              isOrganizationLogoValid
                ? organizationLogo
                : OrganizationLogoDefault
            }
            alt={organizationName}
          />
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
