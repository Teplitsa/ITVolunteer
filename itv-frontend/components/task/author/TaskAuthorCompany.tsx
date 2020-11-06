import { ReactElement, useState, useEffect } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import MemberOrganizationDescription from "../../MemberOrganizationDescription";
import IconApproved from "../../../assets/img/icon-all-done.svg";
import IconBriefcase from "../../../assets/img/icon-briefcase.svg";

const TaskAuthorCompany: React.FunctionComponent = (): ReactElement => {
  const [isCompanyLogoValid, setCompanyLogoValid] = useState<boolean>(false);
  const {
    organizationName: companyName,
    organizationLogo: companyLogo,
    organizationDescription: companySummary,
    isPartner,
  } = useStoreState(state => state.components.task.author);

  useEffect(() => {
    const abortController = new AbortController();

    try {
      companyLogo &&
        fetch(companyLogo, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then(response => setCompanyLogoValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

  return (
    companyName && (
      <>
        <div className="user-org-separator"></div>
        <div className="user-card">
          <div className="user-card-inner">
            <div
              className={`avatar-wrapper ${
                isCompanyLogoValid ? "" : "avatar-wrapper_default-image"
              }`}
              style={{
                backgroundImage: isCompanyLogoValid
                  ? `url(${companyLogo})`
                  : `url(${IconBriefcase})`,
              }}
            >
              {isPartner && <img src={IconApproved} className="itv-approved" />}
            </div>

            <div className="details">
              <span className="status">Представитель организации/проекта</span>
              <span className="name" dangerouslySetInnerHTML={{ __html: companyName }} />
            </div>
          </div>
        </div>
        {companySummary && (
          <div className="org-description">
            <MemberOrganizationDescription {...{ organizationDescription: companySummary }} />
          </div>
        )}
      </>
    )
  );
};

export default TaskAuthorCompany;
