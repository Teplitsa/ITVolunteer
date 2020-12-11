import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import MemberCardSmall from "../../components/members/MemberCardSmall";
import MemberSocials from "../../components/MemberSocials";
import GlobalScripts from "../../context/global-scripts";
import PortfolioItemDeleteConfirm from "../../components/portfolio/PortfolioItemDeleteConfirm";

const { ModalContext } = GlobalScripts;

const ModalContent: React.FunctionComponent<{ closeModal: () => void }> = ({ closeModal }) => (
  <PortfolioItemDeleteConfirm {...{ closeModal }} />
);

const PortfolioItem: React.FunctionComponent = (): ReactElement => {
  const { author, item: portfolioItem } = useStoreState(store => store.components.portfolioItem);

  if (!portfolioItem.id) {
    return <p>Работа не найдена.</p>;
  }

  return (
    <div className="portfolio-item">
      <div className="portfolio-item__content">
        <div className="portfolio-item__columns">
          <div className="portfolio-item__left-column">
            <MemberCardSmall />
          </div>
          <div className="portfolio-item__right-column">
            <h1 className="portfolio-item__title">{portfolioItem.title}</h1>
            <div className="portfolio-item__text">{portfolioItem.description}</div>
          </div>
        </div>
        <div className="portfolio-item__footer">
          <div className="portfolio-item__footer-title">
            Понравилась работа?
            <br />
            Поделитесь с друзьями!
          </div>
          <div className="portfolio-item__share">
            <MemberSocials
              useComponents={["facebook", "twitter", "vk", "telegram"]}
              iconParams={{ size: "40x40", bg: "green-bg" }}
              facebook="https://te-st.ru"
              twitter="te-st"
              vk="https://te-st.ru"
              telegram="te-st"
            />
          </div>
          <div className="portfolio-item__actions">
            <Link
              href="/members/[username]/[portfolio_item_slug]/edit"
              as={`/members/${author.name}/${portfolioItem.slug}/edit`}
            >
              <a className="portfolio-item__action-btn btn btn_default">Редактировать</a>
            </Link>
            <ModalContext.Consumer>
              {({ dispatch }) => (
                <button
                  className="portfolio-item__action-btn btn btn_default"
                  type="button"
                  onClick={event => {
                    event.preventDefault();
                    dispatch({
                      type: "template",
                      payload: {
                        title: "Вы уверены, что хотите удалить работу?",
                        content: ModalContent,
                      },
                    });
                    dispatch({ type: "open" });
                  }}
                >
                  Удалить работу
                </button>
              )}
            </ModalContext.Consumer>
          </div>
        </div>
      </div>
      <div className="portfolio-item__nav">
        <div className="portfolio-item__nav-item">
          <a href="#">Предыдущая работа</a>
        </div>
        <div className="portfolio-item__nav-item">
          <a href="#">Следующая работа</a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
