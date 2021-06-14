import { ReactElement, useState, MouseEvent, Dispatch, SetStateAction } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberListItem from "./MemberListItem";
import MemberListNoItems from "./MemberListNoItems";
import { MemberListSkeletonItemsOnly } from "../skeletons/MemberListSkeleton";
import { USER_PER_PAGE } from "../../model/components/members-model";

const MemberList: React.FunctionComponent<{
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}> = ({ isLoading, setLoading }): ReactElement => {
  const [isMoreLoading, setMoreLoading] = useState<boolean>(false);
  const page = useStoreState(state => state.components.members.userFilter.page);
  const total = useStoreState(state => state.components.members.userListStats.total);
  const members = useStoreState(state => state.components.members.userList);

  const setFilter = useStoreActions(actions => actions.components.members.setFilter);
  const userListRequest = useStoreActions(actions => actions.components.members.userListRequest);

  const handleMoreLink = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    setFilter({ page: page + 1 });
    setLoading(true);
    setMoreLoading(true);
    userListRequest({ setLoading, setMoreLoading });
  };

  if (Object.is(members, null) || (Array.isArray(members) && members.length === 0)) {
    return <MemberListNoItems />;
  }

  return (
    <>
      {(!isLoading || isMoreLoading) && (
        <div className="members-list">
          {members?.map((member) => (
            <MemberListItem key={`Volunteer-${member.id}`} {...{ member }} />
          ))}
        </div>
      )}
      {isLoading && <MemberListSkeletonItemsOnly />}
      {!isLoading && USER_PER_PAGE * page < total && (
        <div className="members-list-more">
          <a href="#" className="members-list-more__link" onClick={handleMoreLink}>
            Показать ещё
          </a>
        </div>
      )}
    </>
  );
};

export default MemberList;
