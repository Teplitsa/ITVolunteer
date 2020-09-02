import { ReactElement, useState, useEffect, useRef } from "react";

const MemberOrganizationDescription: React.FunctionComponent<{
  organizationDescription: string;
}> = ({ organizationDescription }): ReactElement => {
  const [isFullDescription, setFullDescription] = useState<boolean>(false);
  const excerptRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (excerptRef.current.innerHTML.length > 109) {
      excerptRef.current.innerHTML = `${excerptRef.current.innerHTML.substr(
        0,
        109
      )}…`;
    } else {
      setFullDescription(true);
    }
  }, []);

  return (
    organizationDescription && (
      <div className="member-organization-description">
        <span
          ref={excerptRef}
          dangerouslySetInnerHTML={{
            __html: organizationDescription.trim(),
          }}
        />
        {!isFullDescription && (
          <>
            {" "}
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
