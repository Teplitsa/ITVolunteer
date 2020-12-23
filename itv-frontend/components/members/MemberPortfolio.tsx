import { ReactElement, useEffect, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Link from "next/link";
import MemberPortfolioItem from "./MemberPortfolioItem";
import MemberPortfolioNoItems from "../../components/members/MemberPortfolioNoItems";
import NoPreview from "../../assets/img/pic-portfolio-item-no-preview.svg";
import { getMediaData } from "../../utilities/media";

const MemberPortfolio: React.FunctionComponent = (): ReactElement => {
  const userSlug = useStoreState(store => store.components.memberAccount.slug);
  const {list: portfolioList} = useStoreState(state => state.components.memberAccount.portfolio);
  const noPortfolioItems = portfolioList instanceof Array !== true || portfolioList.length === 0;
  const [previewsToLoad, setPreviewsToLoad] = useState<Array<number>>([]);
  const [loadedPreviews, setLoadedPreviews] = useState({});
  const [previews, setPreviews] = useState(portfolioList.reduce((po, { preview }) => {
    po[preview] = NoPreview;
    return po;
  }, {}));
  const { getMemberPortfolioRequest } = useStoreActions(
    actions => actions.components.memberAccount
  );

  useEffect(() => {
    // console.log("portfolioList.map pl:", portfolioList.map(({ preview }) => preview));

    const pl = portfolioList
      .map(({ preview }) => preview)
      .filter(preview => !loadedPreviews[preview]);

    // console.log("pl:", pl);

    setPreviewsToLoad(pl);
  }, [portfolioList]);

  // useEffect(() => {
  //   console.log("loadedPreviews:", Object.keys(loadedPreviews));
  //   console.log("previews:", previews);
  //   console.log("previewsToLoad:", previewsToLoad);
  // }, [previews, previewsToLoad, loadedPreviews]);

  useEffect(() => {
    if (previewsToLoad.length === 0) return;

    const [currentPreviewToLoad, ...restPreviewsToLoad] = previewsToLoad;

    if (currentPreviewToLoad === 0) {
      setPreviewsToLoad(restPreviewsToLoad);
      return;
    }

    const abortController = new AbortController();

    (async () => {
      const mediaData = await getMediaData(currentPreviewToLoad, abortController);

      if (!mediaData) return;

      setLoadedPreviews({...loadedPreviews, currentPreviewToLoad: true});

      const newPreviews = {...previews};

      newPreviews[currentPreviewToLoad] =
        mediaData.mediaItemSizes.logo?.source_url ?? mediaData.mediaItemUrl;

      setPreviews(newPreviews);
      setPreviewsToLoad(restPreviewsToLoad);
    })();

    return () => abortController.abort();
  }, [previewsToLoad]);

  if(noPortfolioItems) {
    return  <MemberPortfolioNoItems />;
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
        {portfolioList.map(({ id, slug, title, preview }) => (
          <MemberPortfolioItem key={id} {...{ userSlug, slug, title, preview: previews[preview] }} />
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
