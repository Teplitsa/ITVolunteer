import { ReactElement, useEffect, useState, useMemo } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Link from "next/link";
import MemberPortfolioItem from "./MemberPortfolioItem";
import MemberPortfolioNoItems from "../../components/members/MemberPortfolioNoItems";
import NoPreview from "../../assets/img/pic-portfolio-item-no-preview.svg";
import { getMediaData } from "../../utilities/media";

const MemberPortfolio: React.FunctionComponent = (): ReactElement => {
  const userSlug = useStoreState(store => store.components.memberAccount.slug);
  const portfolioList = useStoreState(state => state.components.memberAccount.portfolio.list);
  const noPortfolioItems = portfolioList instanceof Array !== true || portfolioList.length === 0;
  const previewsToLoad = useMemo(() => portfolioList.map(({ preview }) => preview), [
    portfolioList,
  ]);
  const [previews, setPreviews] = useState<Array<string>>(
    Array(portfolioList.length).fill(NoPreview)
  );
  const { getMemberPortfolioRequest } = useStoreActions(
    actions => actions.components.memberAccount
  );

  useEffect(() => {
    const abortControllers: Array<AbortController> = [];

    (async () => {
      await Promise.all(
        previewsToLoad.map(async (currentPreviewToLoad, i) => {
          if (currentPreviewToLoad === 0) return previews[i];

          const abortController = new AbortController();
          const mediaData = await getMediaData(currentPreviewToLoad, abortController);

          if (!mediaData) return previews[i];

          const newPreview = mediaData.mediaItemSizes.logo?.source_url ?? mediaData.mediaItemUrl;

          abortControllers[i] = abortController;

          return newPreview;
        })
      ).then(newPreviews => {
        if (!abortControllers.some(abortController => abortController.signal.aborted)) {
          setPreviews(newPreviews);
        }
      });
    })();

    return () => abortControllers.forEach(abortController => abortController.abort());
  }, [previewsToLoad]);

  if (noPortfolioItems) {
    return <MemberPortfolioNoItems />;
  }

  return (
    <div className="member-portfolio">
      <div className="member-portfolio__header">
        <div className="member-portfolio__title">Портфолио</div>
        <div className="member-portfolio__actions">
          <Link
            href="/members/[username]/add-portfolio-item"
            as={`/members/${userSlug}/add-portfolio-item`}
          >
            <a className="btn btn_hint-alt">+ Добавить работу</a>
          </Link>
        </div>
      </div>
      <div className="member-portfolio__list">
        {portfolioList.map(({ id, slug, title }, i) => (
          <MemberPortfolioItem key={id} {...{ userSlug, slug, title, preview: previews[i] }} />
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
