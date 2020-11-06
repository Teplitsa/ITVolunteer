/* eslint-disable react/display-name */
import { MutableRefObject, MouseEvent, useState, useEffect, useRef } from "react";

const withTabs = ({
  tabs,
  defaultActiveIndex = 0,
}: {
  tabs: Array<{
    title: string;
    content: React.FunctionComponent;
  }>;
  defaultActiveIndex?: number;
}): React.FunctionComponent => {
  const addActiveClass = (tabsRef: MutableRefObject<HTMLDivElement>, activeIndex: number) => {
    const tabsNavItems = tabsRef.current.querySelectorAll(`.tabs-nav__item`);
    const tabsContentItems = tabsRef.current.querySelectorAll(`.tabs-content__item`);

    tabsNavItems.forEach(navItem => navItem.classList.remove("tabs-nav__item_active"));
    tabsNavItems[activeIndex].classList.add("tabs-nav__item_active");

    tabsContentItems.forEach(contentItem =>
      contentItem.classList.remove("tabs-content__item_active")
    );
    tabsContentItems[activeIndex].classList.add("tabs-content__item_active");
  };

  return () => {
    const tabsRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex);

    useEffect(() => addActiveClass(tabsRef, activeIndex), [activeIndex]);

    return (
      <div className="tabs" ref={tabsRef}>
        <ul className="tabs-nav">
          {tabs.map((tab, i) => {
            return (
              <li key={`tabsNavItem-${i}`} className="tabs-nav__item">
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
            <div key={`tabsContentItem-${i}`} className="tabs-content__item">
              <TabContent />
            </div>
          ))}
        </div>
      </div>
    );
  };
};

export default withTabs;
