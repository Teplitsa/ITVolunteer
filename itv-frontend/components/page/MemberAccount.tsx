/* eslint-disable react/display-name */
import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import withTabs from "../../components/hoc/withTabs";
import MemberPortfolio from "../../components/members/MemberPortfolio";
import MemberNotifications from "../../components/members/MemberNotifications";
import MemberTasks from "../../components/members/MemberTasks";
import MemberReviews from "../../components/members/MemberReviews";
import MemberCard from "../../components/members/MemberCard";
import MemberUploadCover from "../../components/members/MemberUploadCover";
import MemberAccountNeedAttention from "../../components/members/MemberAccountNeedAttention";
import MemberAccountEmptyTaskList from "../members/MemberAccountEmptyTaskList";
import MemberPortfolioNoItems from  "../members/MemberPortfolioNoItems";
import { regEvent } from "../../utilities/ga-events";
import MemberAccountEmptySectionForGuest from "../members/MemberAccountEmptySectionForGuest";

const MemberAccount: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState(state => state.session.isAccountOwner);
  const userCoverFile = useStoreState(state => state.session.user.coverFile);
  const userItvAvatarFile = useStoreState(state => state.session.user.itvAvatarFile);
  const memberAccountTemplate = useStoreState(state => state.components.memberAccount.template);
  const reviews = useStoreState(state => state.components.memberAccount.reviews.list);
  const taskStats = useStoreState(state => state.components.memberAccount.taskStats);
  const notifications = useStoreState(state => state.components.memberAccount.notifications.list);
  const coverImage = useStoreState(state => state.components.memberAccount.cover);
  const coverFile = useStoreState(state => state.components.memberAccount.coverFile);
  const isEmptyProfile = useStoreState(state => state.components.memberAccount.isEmptyProfile);
  const itvAvatar = useStoreState(state => state.components.memberAccount.itvAvatar);
  const itvAvatarFile = useStoreState(state => state.components.memberAccount.itvAvatarFile);
  const username = useStoreState(state => state.components.memberAccount.username);
  const fullName = useStoreState(state => state.components.memberAccount.fullName);

  const { setUserAvatar, setUserAvatarFile, setUserCover, setUserCoverFile } = useStoreActions(
    actions => actions.session
  );

  const {
    profileFillStatusRequest,
    getMemberNotificationsRequest,
    getMemberNotificationStatsRequest,
  } = useStoreActions(actions => actions.components.memberAccount);
  const router = useRouter();
  const activeTabIndex = router.asPath.search(/#reviews/) !== -1 ? 1 : 0;
  const setCrumbs = useStoreActions(actions => actions.components.breadCrumbs.setCrumbs);

  const tabList: Array<{
    title: string;
    content: React.FunctionComponent;
  }> = [];

  if (isAccountOwner && notifications) {
    tabList.push({
      title: "Оповещения",
      content: MemberNotifications,
    });
  }

  if (memberAccountTemplate === "volunteer") {
    tabList.push({
      title: "Портфолио",
      content: MemberPortfolio,
    });
  }

  if (!Object.values({ ...taskStats, open: 0 }).every(filter => filter === 0)) {
    tabList.push({ title: "Задачи", content: MemberTasks });
  }

  if (reviews && reviews.length > 0) {
    tabList.push({ title: "Отзывы", content: MemberReviews });
  }

  const Tabs = withTabs({
    defaultActiveIndex: activeTabIndex,
    tabs: tabList,
  });

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  useEffect(() => {
    setCrumbs([{ title: "Волонтеры", url: "/members" }, { title: fullName }]);
  }, [fullName]);

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

    if (!isAccountOwner) {
      return;
    }

    getMemberNotificationStatsRequest();
    getMemberNotificationsRequest({ isListReset: true });
  }, [isAccountOwner, username]);

  useEffect(() => {
    if (
      !!itvAvatarFile &&
      _.get(itvAvatarFile, "databaseId") !== _.get(userItvAvatarFile, "databaseId")
    ) {
      setUserAvatar(itvAvatar);
      setUserAvatarFile(itvAvatarFile);
    }
  }, [itvAvatarFile]);

  useEffect(() => {
    if (!!coverFile && _.get(coverFile, "databaseId") !== _.get(userCoverFile, "databaseId")) {
      setUserCover(coverImage);
      setUserCoverFile(coverFile);
    }
  }, [coverFile]);

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
                {memberAccountTemplate === "author" && <MemberAccountEmptyTaskList />}
                {memberAccountTemplate === "volunteer" && <MemberPortfolioNoItems />}
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
