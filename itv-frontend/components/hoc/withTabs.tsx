import { MouseEvent, useState, useEffect, useRef } from "react";

const withTabs = ({
  tabs,
}: {
  tabs: Array<{
    title: string;
    content: React.FunctionComponent;
  }>;
}): React.FunctionComponent => {
  let tabsNavItemActiveRef = useRef<HTMLLIElement>(null);
  let tabsContentItemActiveRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const addActiveClass = () => {
    tabsNavItemActiveRef.current.classList.add("tabs-nav__item_active");
    tabsContentItemActiveRef.current.classList.add("tabs-content__item_active");
  };

  useEffect(addActiveClass, [
    tabsNavItemActiveRef.current,
    tabsContentItemActiveRef.current,
  ]);

  return () => (
    <div className="tabs">
      <ul className="tabs-nav">
        {tabs.map((tab, i) => {
          return (
            <li
              ref={i === activeIndex ? tabsNavItemActiveRef : null}
              key={`tabsNavItem-${i}`}
              className="tabs-nav__item"
            >
              <a
                href="#"
                className="tabs-nav__item-link"
                onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  setActiveIndex(i);
                }}
              >
                {tab.title}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="tabs-content">
        {tabs.map(({ content: TabContent }, i) => (
          <div
            ref={i === activeIndex ? tabsContentItemActiveRef : null}
            key={`tabsContentItem-${i}`}
            className="tabs-content__item"
          >
            <TabContent />
          </div>
        ))}
      </div>
    </div>
  );
};

export default withTabs;
