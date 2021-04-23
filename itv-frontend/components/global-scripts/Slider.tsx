import { Children, ReactElement, useState, useEffect, MouseEvent } from "react";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "../../assets/sass/modules/Slider.module.scss";

export interface ISliderProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  animation?: {
    time: number;
    pauseTime: number;
  };
}

const Slider: React.FunctionComponent<ISliderProps> = ({
  children,
  autoplay = true,
  pauseOnHover = true,
  animation = {
    time: 600,
    pauseTime: 3000,
  },
}): ReactElement => {
  const itemCount = Children.count(children);
  const [isComponentInit, setIsComponentInit] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

  const handleNavItemClick = (event: MouseEvent<HTMLDivElement>) => {
    setActiveIndex(Number(event.currentTarget.dataset.index));
  };

  const handleSliderItemMouseEnter = () => {
    setPause(true);
  };

  const handleSliderItemMouseLeave = () => {
    setPause(false);
  };

  useEffect(() => {
    if (!autoplay || (pauseOnHover && pause)) return;

    const play = () => {
      const newActiveIndex = itemCount - activeIndex === 1 ? 0 : activeIndex + 1;

      setActiveIndex(newActiveIndex);
    };

    const timerId = setTimeout(play, animation.time + animation.pauseTime);

    return () => clearTimeout(timerId);
  }, [activeIndex, pause]);

  useEffect(() => setIsComponentInit(true), []);

  if (itemCount === 0) {
    console.error("The slider has no items.");

    return null;
  }

  return (
    <div className={styles["slider"]}>
      <div
        style={{
          width: `${itemCount * 100}%`,
          transform: `translateX(-${(activeIndex * 100) / itemCount}%)`,
        }}
        className={styles["slider__inner"]}
        onMouseEnter={handleSliderItemMouseEnter}
        onMouseLeave={handleSliderItemMouseLeave}
      >
        {Children.toArray(children).map((item: ReactElement, i) => {
          return (
            <div
              key={`SliderItem-${i}`}
              className={convertObjectToClassName({
                [styles["slider__item"]]: true,
                [styles["slider__item_active"]]: isComponentInit && activeIndex === i,
              })}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className={styles["slider__nav"]}>
        {Children.toArray(children).map((_, i) => {
          return (
            <div
              key={`SliderNavItem-${i}`}
              className={convertObjectToClassName({
                [styles["slider__nav-item"]]: true,
                [styles["slider__nav-item_active"]]: activeIndex === i,
              })}
              data-index={i}
              onClick={handleNavItemClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
