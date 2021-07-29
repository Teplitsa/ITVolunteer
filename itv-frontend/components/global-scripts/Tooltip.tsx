import { Children, ReactElement, useState, useEffect, useRef, MouseEvent } from "react";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "../../assets/sass/modules/Tooltip.module.scss";

interface ITooltipProps {
  putMarkerToCenter?: boolean;
}

const Tooltip: React.FunctionComponent<ITooltipProps> = ({
  children,
  putMarkerToCenter = true,
}): ReactElement => {
  const itemCount = Children.count(children);
  const btnRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activity, setActivity] = useState<boolean>(false);

  const activityHandler = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setActivity(!activity);
  };

  useEffect(() => {
    const offset = (btnRef?.current.offsetWidth ?? 0) / 2;

    if (bodyRef) {
      if (putMarkerToCenter) {
        bodyRef.current.style.left = `${
          offset === 20 ? 0 : offset < 20 ? -(20 - offset) : offset - 20
        }px`;
      } else {
        bodyRef.current.style.left = "0px";
      }
    }
  }, []);

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
            ref={
              (Boolean(element.props["data-tooltip-btn"]) && btnRef) ||
              (Boolean(element.props["data-tooltip-body"]) && bodyRef) ||
              null
            }
          >
            {element}
          </div>
        );
      })}
    </div>
  );
};

export default Tooltip;
