import { ReactElement, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import OrganizationLogo from "../../assets/img/pic-organization.svg";

const MemberCardOrganization: React.FunctionComponent = (): ReactElement => {
  const [isFullDescription, setFullDescription] = useState<boolean>(false);
  const description = `В настоящее время дальневосточный леопард находится на грани вымирания. Это самый редкий из подвидов леопарда: по данным 2017 года, в дикой природе в России сохранилось 87 особей на территории национального парка «Земля леопарда» и от 8 до 12 в Китае.`;

  return (
    <div className="member-card__organization">
      <div className="member-card__organization-header">
        <div className="member-card__organization-logo">
          <img
            className="member-card__organization-logo-image"
            src={OrganizationLogo}
            alt=""
          />
        </div>
        <div className="member-card__organization-top">
          <div className="member-card__organization-name">
            Некоммерческая организация «Леопарды Дальнего Востока»
          </div>
          <div className="member-card__organization-site">
            <a href="https://www.leopard-vostok.ru" target="_blank">
              www.leopard-vostok.ru
            </a>
          </div>
        </div>
      </div>
      <div className="member-card__organization-description">
        {(isFullDescription && description) || `${description.substr(0, 109)}…`}{" "}
        {!isFullDescription && <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            setFullDescription(true);
          }}
        >
          Подробнее
        </a>}
      </div>
    </div>
  );
};

export default MemberCardOrganization;
