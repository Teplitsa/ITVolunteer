import { ReactElement, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberListItem from "./MemberListItem";
import { USER_PER_PAGE } from "../../model/components/members-model";
import Loader from "../Loader";

const MemberList: React.FunctionComponent = (): ReactElement => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const {
    paged,
    userListStats: { total: totalMembers },
    userList: members = null,
  } = useStoreState(state => state.components.members);
  const moreVolunteersRequest = useStoreActions(
    actions => actions.components.members.moreVolunteersRequest
  );

  return members ? (
    <>
      <div className="members-list">
        {members
          ?.filter(member => !!member)
          .map((member, index) => {
            return (
              <MemberListItem
                key={`Volunteer-${member.id}`}
                {...{ isOdd: index % 2 === 0, index: index + 1, member }}
              />
            );
          })}
      </div>
      {USER_PER_PAGE * paged < totalMembers && (
        <div className="members-list-more">
          {(isLoading && <Loader />) || (
            <a
              className="btn btn_secondary"
              href="#"
              onClick={event => {
                event.preventDefault();
                setLoading(true);
                moreVolunteersRequest({ setLoading });
              }}
            >
              Загрузить ещё
            </a>
          )}
        </div>
      )}
    </>
  ) : null;
};

export default MemberList;
