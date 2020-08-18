import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import withTabs from "../../components/hoc/withTabs";
import MemberTasks from "../../components/members/MemberTasks";
import MemberReviews from "../../components/members/MemberReviews";
import MemberCard from "../../components/members/MemberCard";

const MemberAccount: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState((state) => state.session.isLoggedIn);
  const memberAccount = useStoreState(
    (state) => state.components.memberAccount
  );

  const Tabs = withTabs({
    tabs: [
      { title: "Задачи", content: () => <MemberTasks /> },
      { title: "Отзывы", content: () => <MemberReviews /> },
    ],
  });

  return (
    <div className="member-account">
      <div className="member-account__content">
        <div className="member-account__top">
          <button className="btn btn_upload-cover" type="button">
            Загрузить обложку
          </button>
        </div>
        <div className="member-account__columns">
          <div className="member-account__left-column">
            <MemberCard />
          </div>
          <div className="member-account__right-column">
            <Tabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAccount;
