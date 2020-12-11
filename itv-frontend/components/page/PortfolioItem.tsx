import { ReactElement } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  VKShareButton,
  TelegramShareButton,
} from "react-share";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import MemberCardSmall from "../../components/members/MemberCardSmall";
import GlobalScripts from "../../context/global-scripts";
import PortfolioItemDeleteConfirm from "../../components/portfolio/PortfolioItemDeleteConfirm";
import appConfig from "../../app.config";

const { ModalContext } = GlobalScripts;

const ModalContent: React.FunctionComponent<{ closeModal: () => void }> = ({ closeModal }) => (
  <PortfolioItemDeleteConfirm {...{ closeModal }} />
);

const PortfolioItem: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState(store => store.session.isAccountOwner);
  const { author, item: portfolioItem } = useStoreState(store => store.components.portfolioItem);
  const shareUrl = `${appConfig.BaseUrl}/members/${author.name}/${portfolioItem.slug}`;

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
          {typeof portfolioItem.fullImage === "string" && (
            <div className="portfolio-item__center-column">
              <div className="portfolio-item__media">
                <img src={portfolioItem.fullImage} alt="" />
              </div>
            </div>
          )}
        </div>
        <div className="portfolio-item__footer">
          <div className="portfolio-item__footer-title">
            Понравилась работа?
            <br />
            Поделитесь с друзьями!
          </div>
          <div className="portfolio-item__share">
            <FacebookShareButton url={shareUrl}>
              <span className="react-share__icon react-share__icon_40x40 react-share__icon_facebook-green-bg" />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl}>
              <span className="react-share__icon react-share__icon_40x40 react-share__icon_twitter-green-bg" />
            </TwitterShareButton>
            <VKShareButton url={shareUrl}>
              <span className="react-share__icon react-share__icon_40x40 react-share__icon_vk-green-bg" />
            </VKShareButton>
            <TelegramShareButton url={shareUrl}>
              <span className="react-share__icon react-share__icon_40x40 react-share__icon_telegram-green-bg" />
            </TelegramShareButton>
          </div>
          {isAccountOwner && (
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
          )}
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
