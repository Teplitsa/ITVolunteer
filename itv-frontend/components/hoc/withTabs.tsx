/* eslint-disable react/display-name */
import { MutableRefObject, MouseEvent, useState, useEffect, useRef } from "react";

const withTabs = ({
  tabs,
  defaultActiveIndex = 0,
  mode = "landing-nav",
}: {
  tabs: Array<{
    title: string;
    content: React.FunctionComponent;
  }>;
  defaultActiveIndex?: number;
  mode?: "default" | "landing-nav";
}): React.FunctionComponent => {
  const addNavActiveClass = (tabNavItems: NodeListOf<Element>, activeIndex: number) => {
    tabNavItems.forEach(navItem => navItem.classList.remove("tabs-nav__item_active"));
    tabNavItems[activeIndex].classList.add("tabs-nav__item_active");
  };
  const addContentActiveClass = (tabContentItems: NodeListOf<Element>, activeIndex: number) => {
    tabContentItems.forEach(contentItem =>
      contentItem.classList.remove("tabs-content__item_active")
    );
    tabContentItems[activeIndex].classList.add("tabs-content__item_active");
  };
  const addActiveClass = (tabsRef: MutableRefObject<HTMLDivElement>, activeIndex: number) => {
    const tabNavItems = tabsRef.current.querySelectorAll(`.tabs-nav__item`);
    const tabContentItems = tabsRef.current.querySelectorAll(`.tabs-content__item`);

    addNavActiveClass(tabNavItems, activeIndex);

    addContentActiveClass(tabContentItems, activeIndex);
  };

  const scrollToTab = (
    tabsRef: MutableRefObject<HTMLDivElement>,
    activeIndex: number,
    isPageLoaded: boolean
  ) => {
    const tabNavItems = tabsRef.current.querySelectorAll(`.tabs-nav__item`);
    const tabContentItems = tabsRef.current.querySelectorAll(`.tabs-content__item-substitute`);

    addNavActiveClass(tabNavItems, activeIndex);

    isPageLoaded &&
      tabContentItems[activeIndex].scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
  };

  return () => {
    const tabsRef = useRef<HTMLDivElement>(null);
    const tabNavSubstituteRef = useRef<HTMLDivElement>(null);
    const [isFixedNav, setFixedNav] = useState<boolean>(false);
    const [isPageLoaded, setPageLoaded] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex);

    useEffect(() => {
      setPageLoaded(true);

      if (mode !== "landing-nav") return;

      const tabNavItems = tabsRef.current.querySelectorAll(`.tabs-nav__item`);
      const tabContentItems = tabsRef.current.querySelectorAll(`.tabs-content__item`);
      const tabNavObserver = new IntersectionObserver(
        ([tabNavSubstitute]) => {
          setFixedNav(
            !tabNavSubstitute.isIntersecting && tabNavSubstitute.boundingClientRect.y <= 0
          );
        },
        { threshold: 1 }
      );
      const tabContentObserver = new IntersectionObserver(
        tabContentList => {
          tabContentList.forEach(tabContent => {
            if (tabContent.isIntersecting) {
              const activeIndex = Array.from(tabContentItems).findIndex(
                tabContentItem => tabContentItem === tabContent.target
              );
              addNavActiveClass(tabNavItems, activeIndex);
            }
          });
        },
        { threshold: 0.5 }
      );

      tabNavObserver.observe(tabNavSubstituteRef.current);

      tabContentItems.forEach(tabContent => tabContentObserver.observe(tabContent));
    }, []);

    useEffect(() => {
      switch (mode) {
      case "default":
        addActiveClass(tabsRef, activeIndex);
        break;
      case "landing-nav":
        scrollToTab(tabsRef, activeIndex, isPageLoaded);
        break;
      }
    }, [activeIndex]);

    return (
      <div className={`tabs tabs_${mode}`} ref={tabsRef}>
        {mode === "landing-nav" && (
          <div className="tabs-nav-substitute" ref={tabNavSubstituteRef} />
        )}
        <ul
          className={`tabs-nav ${(mode === "landing-nav" && isFixedNav && "tabs-nav_fixed") || ""}`}
          style={(() =>
            (mode === "landing-nav" &&
              isFixedNav && {
              width: tabNavSubstituteRef.current.offsetWidth,
            }) ||
            {})()}
        >
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
              {mode === "landing-nav" && <div className="tabs-content__item-substitute" />}
              <TabContent />
            </div>
          ))}
        </div>
      </div>
    );
  };
};

export default withTabs;
