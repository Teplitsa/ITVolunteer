import { ReactElement, MouseEvent } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const HomeInterfaceSwitch: React.FunctionComponent<{ extraClasses?: string }> = ({ extraClasses }): ReactElement => {
  const template = useStoreState(state => state.components.homePage.template);

  const setTemplate = useStoreActions(actions => actions.components.homePage.setTemplate);

  const onSwitchInterface = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (event.currentTarget.classList.contains("home-interface-switch__item_volunteer")) {
      setTemplate({ template: "volunteer" });
    } else if (event.currentTarget.classList.contains("home-interface-switch__item_author")) {
      setTemplate({ template: "author" });
    }
  };

  return (
    <div className={`home-interface-switch ${extraClasses ?? ""}`.trim()}>
      <button
        className={`home-interface-switch__item home-interface-switch__item_volunteer ${
          template === "volunteer" ? "home-interface-switch__item_active" : ""
        }`}
        type="button"
        onClick={onSwitchInterface}
      >
        Волонтёр
      </button>
      <button
        className={`home-interface-switch__item home-interface-switch__item_author ${
          template === "author" ? "home-interface-switch__item_active" : ""
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
