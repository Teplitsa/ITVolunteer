import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import IconApproved from "../../../assets/img/icon-all-done.svg";

const TaskAuthor: React.FunctionComponent = (): ReactElement => {
  const {
    organizationName: companyName,
    organizationLogo: companyLogo,
    organizationDescription: companySummary,
    isPartner,
  } = useStoreState((state) => state.components.task.author);

  return (
    companyName && (
      <>
        <div className="user-org-separator"></div>
        <div className="user-card">
          <div className="user-card-inner">
            <div
              className="avatar-wrapper"
              style={{
                backgroundImage: companyLogo ? `url(${companyLogo})` : "none",
              }}
            >
              {isPartner && <img src={IconApproved} className="itv-approved" />}
            </div>

            <div className="details">
              <span className="status">Представитель организации/проекта</span>
              <span
                className="name"
                dangerouslySetInnerHTML={{ __html: companyName }}
              />
            </div>
          </div>
        </div>
        {companySummary && (
          <p
            className="org-description"
            dangerouslySetInnerHTML={{ __html: companySummary }}
          />
        )}
      </>
    )
  );
};

export default TaskAuthor;
