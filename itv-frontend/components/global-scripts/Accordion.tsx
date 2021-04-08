import { Children, ReactElement, useState, useRef, useEffect, useLayoutEffect, MutableRefObject } from "react";
import styles from "../../assets/sass/modules/Accordion.module.scss";

type AccordionItemComponents = "title" | "content" | "control";

const AccordionItemComponentList: Array<AccordionItemComponents> = ["title", "content", "control"];

const onActiveIndexSet = (accordionRef: MutableRefObject<HTMLDivElement>, activeIndex: number) => {
  const items = accordionRef.current.querySelectorAll("[data-accordion-item]");

  items.forEach((item: HTMLElement, i) => {
    AccordionItemComponentList.forEach(itemComponentName => {
      const itemComponent: HTMLElement = item.querySelector(
        `[data-accordion-${itemComponentName}]`
      );

      itemComponent.classList[(i === activeIndex && "add") || "remove"](
        styles[`accordion__${itemComponentName}_active`]
      );

      if (itemComponentName === "content") {
        itemComponent.style.height =
          i === activeIndex ? itemComponent.dataset.accordionHeight : "0px";
      }
    });
  });
};

const Accordion: React.FunctionComponent = ({ children }): ReactElement => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const createHandleItemControlClick = (itemIndex: number) => (event: MouseEvent) => {
    event.preventDefault();
    setActiveIndex(prevItemIindex => (prevItemIindex === itemIndex ? -1 : itemIndex));
  };

  useLayoutEffect(() => {
    AccordionItemComponentList.forEach(itemComponentName => {
      const collection = accordionRef.current.querySelectorAll(
        `[data-accordion-${itemComponentName}]`
      );

      collection.forEach((collectionItem: HTMLElement, i) => {
        collectionItem.classList.add(styles[`accordion__${itemComponentName}`]);

        if (itemComponentName === "content") {
          const { height: collectionItemContentHeight } = collectionItem.getBoundingClientRect();

          collectionItem.dataset.accordionHeight = `${collectionItemContentHeight}px`;
          collectionItem.style.height =
            i === activeIndex ? collectionItem.dataset.accordionHeight : "0px";
        } else if (itemComponentName === "control") {
          collectionItem.onclick = createHandleItemControlClick(i);
        }
      });
    });
  }, []);

  useEffect(() => {
    onActiveIndexSet(accordionRef, activeIndex);
  }, [activeIndex]);

  return (
    <div ref={accordionRef} className={styles.accordion}>
      {Children.toArray(children).map((item: ReactElement, i) => {
        if (item.props["data-accordion-item"]) {
          const itemValidComponents: Array<AccordionItemComponents> = [];

          Children.forEach(item.props.children, (childItem: ReactElement) => {
            AccordionItemComponentList.forEach(componentName => {
              if (childItem.props[`data-accordion-${componentName}`]) {
                itemValidComponents.push(componentName);
              }
            });
          });

          const itemInvalidComponents = AccordionItemComponentList.filter(
            componentName => !itemValidComponents.includes(componentName)
          );

          if (itemInvalidComponents.length > 0) {
            console.error(
              `The accordion item #${i} has invalid component(s): ${itemInvalidComponents.join(
                ", "
              )}.`
            );

            return null;
          }

          return item;
        }

        return null;
      })}
    </div>
  );
};

export default Accordion;
