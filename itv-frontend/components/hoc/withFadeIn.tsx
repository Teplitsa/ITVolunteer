import { ReactElement, useState, useEffect, useRef } from "react";
import { convertObjectToClassName } from "../../utilities/utilities";

const withFadeIn: React.FunctionComponent<{
  component: React.FunctionComponent;
  [x: string]: unknown;
}> = ({ component: Component, ...props }): ReactElement => {
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
      className={convertObjectToClassName({
        "fade-in": true,
        "fade-in_active": isShown,
      })}
    >
      <Component {...props} />
    </div>
  );
};

export default withFadeIn;
