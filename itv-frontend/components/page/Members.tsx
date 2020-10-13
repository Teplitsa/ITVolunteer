import { ReactElement, useEffect } from "react";
import {useRouter} from 'next/router';
import { useStoreState } from "../../model/helpers/hooks";
import MembersList from "../members/MembersList";
import { regEvent } from "../../utilities/ga-events";

const Members: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const totalVolunteers = useStoreState(
    (state) => state.components.members.userListStats.total
  );

  useEffect(() => {
    regEvent('ge_show_new_desing', router);
  }, [router.pathname]);

  return (
    <div className="members">
      <div className="members__content">
        <div className="members__top">
          <h1 className="members__title">Волонтеры</h1>
          <div className="members__stats">
            <div className="members__stats-item members__stats-item_volunteers">
              Все волонтеры: {totalVolunteers}
            </div>
          </div>
        </div>
        <div className="members__list">
          <MembersList />
        </div>
      </div>
    </div>
  );
};

export default Members;
