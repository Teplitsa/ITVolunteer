/* eslint-disable react/display-name */
import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import withTabs from "../../components/hoc/withTabs";
import MemberPortfolio from "../../components/members/MemberPortfolio";
import MemberPortfolioNoItems from "../../components/members/MemberPortfolioNoItems";
import MemberNotifications from "../../components/members/MemberNotifications";
import MemberTasks from "../../components/members/MemberTasks";
import MemberReviews from "../../components/members/MemberReviews";
import MemberCard from "../../components/members/MemberCard";
import MemberUploadCover from "../../components/members/MemberUploadCover";
import MemberAccountNeedAttention from "../../components/members/MemberAccountNeedAttention";
import MemberAccountEmptyTaskList from "../members/MemberAccountEmptyTaskList";
import { regEvent } from "../../utilities/ga-events";
import MemberAccountEmptySectionForGuest from "../members/MemberAccountEmptySectionForGuest";

const MemberAccount: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState(state => state.session.isAccountOwner);
  const {
    cover: coverImage,
    isEmptyProfile,
    itvAvatar,
    username,
    portfolio: { list: portfolioList },
  } = useStoreState(state => state.components.memberAccount);
  const { profileFillStatusRequest, getMemberTaskStatsRequest } = useStoreActions(
    actions => actions.components.memberAccount
  );
  const router = useRouter();
  const noPortfolioItems = portfolioList instanceof Array !== true || portfolioList.length === 0;
  const activeTabIndex = router.asPath.search(/#reviews/) !== -1 ? 1 : 0;

  const Tabs = withTabs({
    defaultActiveIndex: activeTabIndex,
    tabs: [
      {
        title: "Оповещения",
        content: () => <MemberNotifications />,
      },
      {
        title: "Портфолио",
        content:
          (noPortfolioItems && (() => <MemberPortfolioNoItems />)) || (() => <MemberPortfolio />),
      },
      { title: "Задачи", content: () => <MemberTasks /> },
      { title: "Отзывы", content: () => <MemberReviews /> },
    ],
  });

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  useEffect(() => {
    if (!isAccountOwner) {
      return;
    }

    profileFillStatusRequest();
  }, [isAccountOwner, coverImage, itvAvatar]);

  useEffect(() => {
    if (!username) {
      return;
    }

    getMemberTaskStatsRequest();
  }, [username]);

  return (
    <div className="member-account">
      <div className="member-account__content">
        <div
          className="member-account__top"
          style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}
        >
          {isAccountOwner && (
            <div className="member-account__top-inner">
              <MemberUploadCover />
            </div>
          )}
        </div>
        <div className="member-account__columns">
          <div className="member-account__left-column">
            <MemberCard />
          </div>
          <div className="member-account__right-column">
            {isAccountOwner && !isEmptyProfile && (
              <div className="member-account__create-task">
                <div className="member-account__create-task-button">
                  <Link href="/task-actions">
                    <a
                      className="btn btn_primary"
                      target="_blank"
                      onClick={() => regEvent("m_ntask", router)}
                    >
                      Создать новую задачу
                    </a>
                  </Link>
                </div>
              </div>
            )}
            {!isEmptyProfile && <Tabs />}
            {isEmptyProfile && isAccountOwner && (
              <>
                <MemberAccountNeedAttention />
                {/* <MemberAccountEmptyServiceShow /> */}
                <MemberAccountEmptyTaskList />
              </>
            )}
            {isEmptyProfile && !isAccountOwner && <MemberAccountEmptySectionForGuest />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAccount;
