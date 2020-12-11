import { ReactElement, useEffect, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Link from "next/link";
import MemberPortfolioItem from "./MemberPortfolioItem";
import NoPreview from "../../assets/img/pic-portfolio-item-no-preview.svg";
import { getMediaData } from "../../utilities/media";

const MemberPortfolio: React.FunctionComponent = (): ReactElement => {
  const {
    username,
    portfolio: { list: portfolioList },
  } = useStoreState(store => store.components.memberAccount);
  const [previewsToLoad, setPreviewsToLoad] = useState<Array<number>>(
    portfolioList.map(({ preview }) => preview)
  );
  const [previews, setPreviews] = useState(Array(portfolioList.length).fill(NoPreview));
  const { getMemberPortfolioRequest } = useStoreActions(
    actions => actions.components.memberAccount
  );

  useEffect(() => {
    if (previewsToLoad.length === 0) return;

    const [currentPreviewToLoad, ...restPreviewsToLoad] = previewsToLoad;

    if (currentPreviewToLoad === 0) {
      setPreviewsToLoad(restPreviewsToLoad);
      return;
    }

    const currentPreviewIndex = portfolioList.length - previewsToLoad.length;
    const abortController = new AbortController();

    (async () => {
      const mediaData = await getMediaData(currentPreviewToLoad, abortController);

      if (!mediaData) return;

      const newPreviews = [].concat(previews);

      newPreviews[currentPreviewIndex] = mediaData.mediaItemUrl;

      setPreviews(newPreviews);
      setPreviewsToLoad(restPreviewsToLoad);
    })();

    return () => abortController.abort();
  }, [previewsToLoad]);

  return (
    <div className="member-portfolio">
      <div className="member-portfolio__header">
        <div className="member-portfolio__title">Портфолио</div>
        <div className="member-portfolio__actions">
          <Link
            href="/members/[username]/add-portfolio-item"
            as={`/members/${username}/add-portfolio-item`}
          >
            <a className="btn btn_hint-alt" target="_blank">
              + Добавить работу
            </a>
          </Link>
        </div>
      </div>
      <div className="member-portfolio__list">
        {portfolioList.map(({ id, slug, title }, i) => (
          <MemberPortfolioItem key={id} {...{ username, slug, title, preview: previews[i] }} />
        ))}
      </div>
      <div className="member-portfolio__footer">
        <a
          href="#"
          className="member-portfolio__more-link"
          onClick={event => {
            event.preventDefault();
            getMemberPortfolioRequest();
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberPortfolio;
