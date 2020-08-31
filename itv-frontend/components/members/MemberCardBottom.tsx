import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import MemberSocials from "../MemberSocials";

const MemberCardBottom: React.FunctionComponent = (): ReactElement => {
  const {
    registrationDate,
    email,
    phone,
    facebook,
    twitter,
    vk,
    skype,
    telegram,
  } = useStoreState((state) => state.components.memberAccount);

  return (
    <div className="member-card__bottom">
      <div className="member-card__contacts">
        <div className="member-card__contacts-email">
          <a href={`mail:${email}`}>{email}</a>
        </div>
        {phone && (
          <div className="member-card__contacts-phone">
            <a href={`tel:${phone.replace(/[^0-9|+]+/g, "")}`}>{phone}</a>
          </div>
        )}
      </div>
      <MemberSocials
        {...{
          useComponents: ["facebook", "twitter", "vk", "skype", "telegram"],
          facebook,
          twitter,
          vk,
          skype,
          telegram,
        }}
      />
      <div className="member-card__registration-date">
        Участвует с{" "}
        {new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(registrationDate * 1000))}
      </div>
    </div>
  );
};

export default MemberCardBottom;
