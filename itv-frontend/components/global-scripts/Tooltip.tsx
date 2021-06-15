import { Children, ReactElement, useState, MouseEvent } from "react";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "../../assets/sass/modules/Tooltip.module.scss";

const Tooltip: React.FunctionComponent = ({ children }): ReactElement => {
  const itemCount = Children.count(children);
  const [activity, setActivity] = useState<boolean>(false);

  const activityHandler = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    setActivity(!activity);
  };

  if (itemCount === 0) {
    console.error("The tolotip has no content.");

    return null;
  }

  return (
    <div className={styles["tooltip"]}>
      {Children.toArray(children).map((element: ReactElement, i) => {
        return (
          <div
            key={`TooltipElement-${i}`}
            className={convertObjectToClassName({
              [styles["tooltip__btn"]]: Boolean(element.props["data-tooltip-btn"]),
              [styles["tooltip__body"]]: Boolean(element.props["data-tooltip-body"]),
              [styles["tooltip__body_active"]]:
                Boolean(element.props["data-tooltip-body"]) && activity,
            })}
            onClick={(Boolean(element.props["data-tooltip-btn"]) && activityHandler) || null}
          >
            {element}
          </div>
        );
      })}
    </div>
  );
};

export default Tooltip;
