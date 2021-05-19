import { ReactElement, useState, useEffect, useRef } from "react";
import { convertObjectToClassName } from "../../utilities/utilities";

const withSlideIn: React.FunctionComponent<{
  component: React.FunctionComponent;
  fullWidth?: boolean;
  from?: "left" | "right";
  key?: any;
  [x: string]: unknown;
}> = ({ component: Component, fullWidth = true, from = "left", key="", ...props }): ReactElement => {
  const [isShown, show] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new IntersectionObserver(([containerRef]) => containerRef.isIntersecting && show(true), {
      threshold: 0,
    }).observe(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      key={key}
      className={convertObjectToClassName({
        "slide-in": true,
        "slide-in_full-width": fullWidth,
        "slide-in_from-left": from === "left",
        "slide-in_from-right": from === "right",
        "slide-in_active": isShown,
      })}
    >
      <Component {...props} />
    </div>
  );
};

export default withSlideIn;
