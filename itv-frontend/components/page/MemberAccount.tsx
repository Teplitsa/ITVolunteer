import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import withTabs from "../../components/hoc/withTabs";
import MemberTasks from "../../components/members/MemberTasks";
import MemberReviews from "../../components/members/MemberReviews";
import MemberCard from "../../components/members/MemberCard";
import MemberUploadCover from "../../components/members/MemberUploadCover";
import MemberAccountNeedAttention from "../../components/members/MemberAccountNeedAttention";
import MemberAccountEmptyServiceShow from "../members/MemberAccountEmptyServiceShow";
import MemberAccountEmptyTaskList from "../members/MemberAccountEmptyTaskList"
import { regEvent } from "../../utilities/ga-events";

const MemberAccount: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState((state) => state.session.isAccountOwner);
  const {cover: coverImage, isEmptyProfile, profileFillStatus, itvAvatar} = useStoreState(
    (state) => state.components.memberAccount
  );
  const profileFillStatusRequest = useStoreActions(
    (actions) => actions.components.memberAccount.profileFillStatusRequest
  );  
  const router = useRouter();
  const activeTabIndex = router.asPath.search(/#reviews/) !== -1 ? 1 : 0;

  const Tabs = withTabs({
    defaultActiveIndex: activeTabIndex,
    tabs: [
      { title: "Задачи", content: () => <MemberTasks /> },
      { title: "Отзывы", content: () => <MemberReviews /> },
    ],
  });

  useEffect(() => {
    regEvent('ge_show_new_desing', router);
  }, [router.pathname]);

  useEffect(() => {
    if(!isAccountOwner) {
      return
    }

    profileFillStatusRequest();
  }, [isAccountOwner, coverImage, itvAvatar])

  useEffect(() => {
    console.log("profileFillStatus:", profileFillStatus)
  }, [profileFillStatus])

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
                    <a className="btn btn_primary" target="_blank">
                      Создать новую задачу
                    </a>
                  </Link>
                </div>
              </div>
            )}
            {!isEmptyProfile &&
              <Tabs />
            }
            {isEmptyProfile && isAccountOwner &&
              <>
              <MemberAccountNeedAttention />
              {/* <MemberAccountEmptyServiceShow /> */}
              <MemberAccountEmptyTaskList />
              </>
            }
            {isEmptyProfile && !isAccountOwner &&
              <div className="member-account-null__empty-section guest-view">
                <div className="empty-section__content">
                  <p>К сожалению, пользователь пока не совершил действий на платформе.</p>
                  <p>Мы очень надеемся, что скоро это изменится</p>
                </div>
              </div>
            }
            </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAccount;
