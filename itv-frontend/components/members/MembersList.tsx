import { ReactElement, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MembersListItem from "./MembersListItem";
import { USER_PER_PAGE } from "../../model/components/members-model";
import Loader from "../Loader";

const MembersList: React.FunctionComponent = (): ReactElement => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const {
    paged,
    userListStats: { total: totalVolunteers },
    userList: volunteers = null,
  } = useStoreState((state) => state.components.members);
  const moreVolunteersRequest = useStoreActions(
    (actions) => actions.components.members.moreVolunteersRequest
  );
  
  return !!volunteer ? (
    <>
      <div className="members-list">
        {volunteers?.map((volunteer, index) => {
          return (
            <MembersListItem
              key={`Volunteer-${volunteer.id}`}
              {...{ isOdd: index % 2 === 0, index: index + 1, volunteer }}
            />
          );
        })}
      </div>
      {USER_PER_PAGE * paged < totalVolunteers && (
        <div className="members-list-more">
          {(isLoading && <Loader />) || (
            <a
              className="btn btn_secondary"
              href="#"
              onClick={(event) => {
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

export default MembersList;
