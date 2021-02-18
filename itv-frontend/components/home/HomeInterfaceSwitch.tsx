import { ReactElement, useState, MouseEvent } from "react";
import { MemberAccountTemplate } from "../../model/model.typing";

const HomeInterfaceSwitch: React.FunctionComponent = (): ReactElement => {
  const [homeInterface, setHomeInterface] = useState<MemberAccountTemplate>("volunteer");

  const onSwitchInterface = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (event.currentTarget.classList.contains("home-interface-switch__item_volunteer")) {
      setHomeInterface("volunteer");
    } else if (event.currentTarget.classList.contains("home-interface-switch__item_author")) {
      setHomeInterface("author");
    }
  };

  return (
    <div className="home-interface-switch">
      <button
        className={`home-interface-switch__item home-interface-switch__item_volunteer ${
          homeInterface === "volunteer" ? "home-interface-switch__item_active" : ""
        }`}
        type="button"
        onClick={onSwitchInterface}
      >
        Волонтер
      </button>
      <button
        className={`home-interface-switch__item home-interface-switch__item_author ${
          homeInterface === "author" ? "home-interface-switch__item_active" : ""
        }`}
        type="button"
        onClick={onSwitchInterface}
      >
        Заказчик
      </button>
    </div>
  );
};

export default HomeInterfaceSwitch;
