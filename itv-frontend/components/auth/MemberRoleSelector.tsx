import { ReactElement, useState, useEffect } from "react";

import roleAuthorIcon from "../../assets/img/auth-role-author.svg";
import roleDoerIcon from "../../assets/img/auth-role-doer.svg";

const MemberRoleSelector: React.FunctionComponent<{
  role: string;
  // eslint-disable-next-line no-unused-vars
  setRole: (role: string) => void;
}> = ({ role, setRole }): ReactElement => {
  const [activeRoles, setActiveRoles] = useState({});

  useEffect(() => {
    setActiveRoles({ [role]: true });
  }, []);

  function handleRoleClick(e) {
    const selectedRole = e.currentTarget.dataset.role;
    setActiveRoles({ [selectedRole]: true });
    setRole(selectedRole);
  }

  return (
    <div className="role-selector">
      <h2>Чем бы вы хотели заниматься на платформе помощи IT?</h2>
      <ul className="role-selector__options">
        <li
          className={`role-selector__option ${activeRoles["author"] && "active"}`}
          onClick={handleRoleClick}
          data-role="author"
        >
          <div className="icon">
            <img src={roleAuthorIcon} />
          </div>
          <div className="text">
            <h3>Я заказчик</h3>
            <p>
              Представляю НКО, социальное предприятие, гражданскую инициативу. Хочу ставить задачи и
              искать волонтёров
            </p>
          </div>
        </li>

        <li
          className={`role-selector__option ${activeRoles["doer"] && "active"}`}
          onClick={handleRoleClick}
          data-role="doer"
        >
          <div className="icon">
            <img src={roleDoerIcon} />
          </div>
          <div className="text">
            <h3>Я IT-волонтёр</h3>
            <p>
              Могу помочь с программированием, дизайном, текстами, фотографиями или юридическими
              вопросами
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MemberRoleSelector;
