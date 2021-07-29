import { ReactElement, useState, useEffect, useRef } from "react";
import { IScreenLoader } from "../../context/global-scripts";
import styles from "../../assets/sass/modules/ScreenLoader.module.scss";

const ScreenLoader: React.FunctionComponent<IScreenLoader> = ({ isShown }): ReactElement => {
  const [isActive, setActivity] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTimerRef = useRef<NodeJS.Timeout>(null);

  useEffect(
    () => () => {
      clearTimeout(activeTimerRef.current);
    },
    []
  );

  useEffect(() => {
    setActivity(isShown ?? false);
  }, [isShown]);

  useEffect(() => {
    activeTimerRef.current = setTimeout(
      () =>
        containerRef.current?.classList[isActive ? "add" : "remove"](styles.screenloader_active),
      0
    );
  }, [isActive]);

  return (
    isShown && (
      <div ref={containerRef} className={styles.screenloader}>
        <div className={styles.screenloader__content}>
          <div className={styles.screenloader__spinner}>
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    )
  );
};

export default ScreenLoader;
