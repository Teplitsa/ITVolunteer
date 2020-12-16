import { ReactElement, useState, useEffect } from "react";

import roleAuthorIcon from "../../assets/img/auth-role-author.svg";
import roleDoerIcon from "../../assets/img/auth-role-doer.svg";

const MemberRoleSelector: React.FunctionComponent<{
  role: string;
  setRole: (role: string) => void;
}> = ({
  role,
  setRole
}): ReactElement => {
  const [activeRoles, setActiveRoles] = useState({});

  useEffect(() => {
    setActiveRoles({[role]: true});
  }, []);

  function handleRoleClick(e) {
    const selectedRole = e.currentTarget.dataset.role;
    setActiveRoles({[selectedRole]: true});
    setRole(selectedRole);
  }
  
  return (
    <div className="role-selector">
      <h2>Чем бы вы хотели заниматься на платформе помощи IT?</h2>
      <ul className="role-selector__options">

        <li className={`role-selector__option ${activeRoles["author"] && "active"}`} onClick={handleRoleClick} data-role="author">
          <div className="icon">
            <img src={roleAuthorIcon} />
          </div>
          <div className="text">
            <h3>Мне нужна помощь</h3>
            <p>Я представляю НКО, соц.предприятие, гражданскую инициативу</p>
          </div>
        </li>

        <li className={`role-selector__option ${activeRoles["doer"] && "active"}`} onClick={handleRoleClick} data-role="doer">
          <div className="icon">
            <img src={roleDoerIcon} />
          </div>
          <div className="text">
            <h3>Хочу помочь</h3>
            <p>Я разбираюсь в сферах, связанных с ИТ и хочу помогать делясь своим опытом</p>
          </div>
        </li>

      </ul>
    </div>
  );
};

export default MemberRoleSelector;
