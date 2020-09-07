import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState } from "../../model/helpers/hooks";
import withTabs from "../../components/hoc/withTabs";
import MemberTasks from "../../components/members/MemberTasks";
import MemberReviews from "../../components/members/MemberReviews";
import MemberCard from "../../components/members/MemberCard";
import MemberUploadCover from "../../components/members/MemberUploadCover";

const MemberAccount: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState((state) => state.session.isAccountOwner);
  const coverImage = useStoreState(
    (state) => state.components.memberAccount.cover
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
            {isAccountOwner && (
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
            <Tabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAccount;
