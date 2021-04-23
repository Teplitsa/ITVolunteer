import { ReactElement, useState, MouseEvent, useEffect } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import Accordion from "../global-scripts/Accordion";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";
import { IFaq } from "../../model/model.typing";

const MAX_FAQ_COUNT_TO_PREVIEW = 3;

const HomeFAQAccordionVolunteer: React.FunctionComponent<{ volunteerFaqs: Array<IFaq> }> = ({
  volunteerFaqs,
}): ReactElement => {
  return (
    <Accordion>
      {volunteerFaqs.map(({ _id, title, content }) => {
        return (
          <div key={`HomeFaqItem-${_id}`} data-accordion-item className="home-faq__item">
            <div data-accordion-title className="home-faq__item-title">
              <div data-accordion-control dangerouslySetInnerHTML={{ __html: title }} />
            </div>
            <div
              data-accordion-content
              className="home-faq__item-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div data-accordion-control className="home-faq__item-control" />
          </div>
        );
      })}
    </Accordion>
  );
};

const HomeFAQAccordionAuthor: React.FunctionComponent<{ authorFaqs: Array<IFaq> }> = ({
  authorFaqs,
}): ReactElement => {
  return (
    <Accordion>
      {authorFaqs.map(({ _id, title, content }) => {
        return (
          <div key={`HomeFaqItem-${_id}`} data-accordion-item className="home-faq__item">
            <div
              data-accordion-title
              className="home-faq__item-title"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div
              data-accordion-content
              className="home-faq__item-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div data-accordion-control className="home-faq__item-control" />
          </div>
        );
      })}
    </Accordion>
  );
};

const HomeFAQ: React.FunctionComponent = (): ReactElement => {
  const [isFullListShown, setIsFullListShown] = useState<boolean>(false);
  const template = useStoreState(state => state.components.homePage.template);
  const faqList = useStoreState(state => state.components.homePage.faqList);

  const faqs = isFullListShown
    ? faqList.filter(({ userRole }) => userRole === template)
    : faqList.filter(({ userRole }) => userRole === template).slice(0, MAX_FAQ_COUNT_TO_PREVIEW);

  const HomeFAQAccordion: React.FunctionComponent = (): ReactElement =>
    (template === "author" && <HomeFAQAccordionAuthor {...{ authorFaqs: faqs }} />) || (
      <HomeFAQAccordionVolunteer {...{ volunteerFaqs: faqs }} />
    );

  const handleShowFullList = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    setIsFullListShown(true);
  };

  useEffect(() => {
    isFullListShown && setIsFullListShown(false);
  }, [template]);

  return (
    <section className="home-faq">
      <h3 className="home-faq__title home-title">Остались вопросы?</h3>
      <HomeInterfaceSwitch />
      <HomeFAQAccordion />
      {faqs.length > MAX_FAQ_COUNT_TO_PREVIEW && !isFullListShown && (
        <button className="home-faq__more btn btn_link" type="button" onClick={handleShowFullList}>
          Все вопросы
        </button>
      )}
    </section>
  );
};

export default HomeFAQ;
