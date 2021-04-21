import { ReactElement, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IMemberListItem } from "../../model/model.typing";
import MemberStats from "../MemberStats";
import MemberOrganizationDescription from "../MemberOrganizationDescription";
import MemberAvatar from "../MemberAvatar";
import MemberSocials from "../MemberSocials";
import { isLinkValid } from "../../utilities/utilities";

const MemberListItem: React.FunctionComponent<{
  isOdd: boolean;
  index: number;
  member: IMemberListItem;
}> = ({ isOdd, index, member }): ReactElement => {
  const [isShown, show] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new IntersectionObserver(([containerRef]) => containerRef.isIntersecting && show(true), {
      threshold: 0,
    }).observe(ref.current);
  }, []);

  return (
    <>
      {index === 11 && <div className="members-list-divider" />}
      <div
        ref={ref}
        className={`members-list__item ${
          isOdd ? "members-list__item_odd" : "members-list__item_even"
        } ${isShown ? "members-list__item_shown" : ""} volunteer ${
          index <= 10 ? "volunteer_top" : ""
        }`}
      >
        <div className="volunteer__header">
          <div className="volunteer__avatar">
            <MemberAvatar
              {...{
                memberAvatar: member.itvAvatar,
                memberFullName: member.fullName,
                size: "medium",
              }}
            />
          </div>
          <div className="volunteer__bage">
            <div className="volunteer__full-name">
              <Link href={`/members/${member.slug}`}>
                <a
                  className="volunteer__account-link"
                  target="_blank"
                  dangerouslySetInnerHTML={{ __html: member.fullName }}
                />
              </Link>
            </div>
            <div className="volunteer__role">
              <div className="volunteer__role-bage">{member.memberRole}</div>
            </div>
            <div
              className="volunteer__organization-name"
              dangerouslySetInnerHTML={{ __html: member.organizationName }}
            />
          </div>
        </div>
        <div className="volunteer__stats">
          <MemberStats
            {...{
              rating: member.rating,
              memberSlug: member.slug,
              reviewsCount: member.reviewsCount,
              xp: member.xp,
              solvedProblems: member.solvedProblems,
              withTopdivider: true,
              align: "left",
            }}
          />
        </div>
        {member.organizationDescription && (
          <div className="volunteer__organization-description">
            <MemberOrganizationDescription
              {...{
                organizationDescription: member.organizationDescription,
              }}
            />
          </div>
        )}
        <div className="volunteer__footer">
          <div className="volunteer__socials">
            <MemberSocials
              {...{
                useComponents: ["facebook", "instagram", "vk"],
                facebook: member.facebook,
                instagram: member.instagram,
                vk: member.vk,
              }}
            />
          </div>
          {isLinkValid(member.organizationSite) && (
            <div className="volunteer__organization-site">
              <a href={member.organizationSite} target="_blank" rel="noreferrer">
                {new URL(member.organizationSite).hostname}
              </a>
            </div>
          )}
          <div className="volunteer__registration-date">
            Регистрация{" "}
            {new Intl.DateTimeFormat("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(member.registrationDate * 1000))}
          </div>
        </div>
        {index <= 10 && <div className="volunteer__index">{index}</div>}
      </div>
    </>
  );
};

export default MemberListItem;
