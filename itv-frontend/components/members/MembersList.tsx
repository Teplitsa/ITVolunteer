import { ReactElement, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MembersListItem from "./MembersListItem";
import Loader from "../Loader";

const MembersList: React.FunctionComponent = (): ReactElement => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const {
    pageInfo: { hasNextPage: hasMoreVolunteers },
    edges: volunteers = null,
  } = useStoreState((state) => state.components.members.list);
  const moreVolunteersRequest = useStoreActions(
    (actions) => actions.components.members.moreVolunteersRequest
  );

  return (
    <>
      <div className="members-list">
        {volunteers?.map(({ node: volunteer }, index) => {
          return (
            <MembersListItem
              key={`Volunteer-${volunteer.id}`}
              {...{ index: index + 1, volunteer }}
            />
          );
        })}
      </div>
      {hasMoreVolunteers && (
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
  );
};

export default MembersList;
