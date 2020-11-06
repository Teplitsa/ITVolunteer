import { ReactElement, useState, useEffect, useRef } from "react";

const withSlideIn: React.FunctionComponent<{
  component: React.FunctionComponent;
  fullWidth?: boolean;
  from?: "left" | "right";
}> = ({ component: Component, fullWidth = true, from = "left" }): ReactElement => {
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
      className={`slide-in${fullWidth ? " slide-in_full-width" : ""} slide-in_from-${from}${
        isShown ? " slide-in_active" : ""
      }`}
    >
      <Component />
    </div>
  );
};

export default withSlideIn;
