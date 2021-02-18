import { ReactElement } from "react";
import Accordion from "../global-scripts/Accordion";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";

const HomeFAQ: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-faq">
      <h3 className="home-faq__title home-title">Остались вопросы?</h3>
      <HomeInterfaceSwitch />
      <Accordion>
        <div data-accordion-item className="home-faq__item">
          <div data-accordion-title className="home-faq__item-title">
            Хочу помочь. Как мне выбрать задачу?
          </div>
          <div data-accordion-content className="home-faq__item-content">
            <p>
              Выбрать задачу поможет быстро запустить красивый сайт НКО без финансовых затрат и
              программирования. Начните работать на своем новом сайте уже сегодня.
            </p>
            <p>
              <a href="#">Хочу помочь</a>
            </p>
          </div>
          <div data-accordion-control className="home-faq__item-control" />
        </div>
        <div data-accordion-item className="home-faq__item">
          <div data-accordion-title className="home-faq__item-title">
            У меня мало опыта, но хочу быть полезным. Могу откликаться на задачи?
          </div>
          <div data-accordion-content className="home-faq__item-content">
            <p>
              Выбрать задачу поможет быстро запустить красивый сайт НКО без финансовых затрат и
              программирования. Начните работать на своем новом сайте уже сегодня.
            </p>
            <p>
              <a href="#">Хочу помочь</a>
            </p>
          </div>
          <div data-accordion-control className="home-faq__item-control" />
        </div>
        <div data-accordion-item className="home-faq__item">
          <div data-accordion-title className="home-faq__item-title">
            Могу кому-нибудь помочь. А что я получу взамен?
          </div>
          <div data-accordion-content className="home-faq__item-content">
            <p>
              Выбрать задачу поможет быстро запустить красивый сайт НКО без финансовых затрат и
              программирования. Начните работать на своем новом сайте уже сегодня.
            </p>
            <p>
              <a href="#">Хочу помочь</a>
            </p>
          </div>
          <div data-accordion-control className="home-faq__item-control" />
        </div>
      </Accordion>
      <button className="home-faq__more btn btn_link" type="button">
        Все вопросы
      </button>
    </section>
  );
};

export default HomeFAQ;
