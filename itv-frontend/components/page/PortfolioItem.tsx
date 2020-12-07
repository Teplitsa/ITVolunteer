import { ReactElement } from "react";
import Link from "next/link";
// import { useStoreState } from "../../model/helpers/hooks";
import MemberCardSmall from "../../components/members/MemberCardSmall";
import MemberSocials from "../../components/MemberSocials";
import GlobalScripts from "../../context/global-scripts";
import PortfolioItemDeleteConfirm from "../../components/portfolio/PortfolioItemDeleteConfirm";

const { ModalContext } = GlobalScripts;

const ModalContent: React.FunctionComponent<{ closeModal: () => void }> = ({ closeModal }) => (
  <PortfolioItemDeleteConfirm {...{ closeModal }} />
);

const PortfolioItem: React.FunctionComponent<{
  username: string;
  portfolioItemSlug: string;
}> = ({ username, portfolioItemSlug }): ReactElement => {
  // const {
  //   user: { username },
  // } = useStoreState(store => store.session);

  return (
    <div className="portfolio-item">
      <div className="portfolio-item__content">
        <div className="portfolio-item__columns">
          <div className="portfolio-item__left-column">
            <MemberCardSmall />
          </div>
          <div className="portfolio-item__right-column">
            <h1 className="portfolio-item__title">
              Нужен сайт на Word Press для нашей организации
            </h1>
            <div className="portfolio-item__text">
              <p>
                Основная награда для любого волонтёра — реальный эффект от помощи и продуктивное
                общение по задаче.
              </p>
              <p>
                Заботьтесь о мотивации волонтёров. Небольшими наградами вы можете отблагодарить их
                за помощь. Вот примеры — от символическим подарков до денежных вознаграждений.
              </p>
              <p>
                Заботьтесь о мотивации волонтёров. Небольшими наградами вы можете отблагодарить их
                за помощь. Вот примеры — от символическим подарков до денежных вознаграждений.
              </p>
            </div>
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
              as={`/members/${username}/${portfolioItemSlug}/edit`}
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
