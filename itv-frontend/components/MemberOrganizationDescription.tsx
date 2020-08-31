import { ReactElement, useState } from "react";

const MemberOrganizationDescription: React.FunctionComponent<{
  organizationDescription: string;
}> = ({ organizationDescription }): ReactElement => {
  const [isFullDescription, setFullDescription] = useState<boolean>(false);

  return (
    organizationDescription && (
      <div className="member-organization-description">
        <span
          dangerouslySetInnerHTML={{
            __html:
              (isFullDescription && organizationDescription) ||
              `${organizationDescription.trim().substr(0, 109)}`,
          }}
        />
        {organizationDescription.trim().length > 109 && !isFullDescription && (
          <>
            {"… "}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setFullDescription(true);
              }}
            >
              Подробнее
            </a>
          </>
        )}
      </div>
    )
  );
};

export default MemberOrganizationDescription;
