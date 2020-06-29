import { ReactElement, useState, useEffect, useRef } from "react";

const HonorsListItemIndex: React.FunctionComponent<{ itemIndex: number }> = ({
  itemIndex,
}): ReactElement => {
  const [isItemIndexShown, showItemIndex] = useState<boolean>(false);
  const itemIndexRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    new IntersectionObserver(
      ([spanRef]) => spanRef.isIntersecting && showItemIndex(true),
      { threshold: 0 }
    ).observe(itemIndexRef.current);
  }, []);

  return (
    <span
      ref={itemIndexRef}
      className={`honors-list__item-index${
        isItemIndexShown ? " honors-list__item-index_active" : ""
      }`}
    >
      {String(++itemIndex).padStart(2, "0")}
    </span>
  );
};

export default HonorsListItemIndex;
