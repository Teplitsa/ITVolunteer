import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import IconTags from "../../../assets/img/icon-color-picker.svg";
import IconNgoTags from "../../../assets/img/icon-people.svg";
import IconRewardTags from "../../../assets/img/icon-gift-box.svg";
import TaskTagGroup from "./TaskTagGroup";

const TaskTags: React.FunctionComponent = (): ReactElement => {
  const {
    tags: { nodes: tags },
    rewardTags: { nodes: rewardTags },
    ngoTaskTags: { nodes: ngoTags },
  } = useStoreState((state) => state.components.task as any);

  const tagGroups = [];

  tags?.length && tagGroups.push(["tags", IconTags, tags]);
  ngoTags?.length && tagGroups.push(["ngoTags", IconNgoTags, ngoTags]);
  rewardTags?.length &&
    tagGroups.push(["rewardTags", IconRewardTags, rewardTags]);

  return (
    <div className="meta-terms">
      {tagGroups.map(([groupId, icon, tagGroup]) => {
        return (
          <TaskTagGroup key={groupId}>
            <img src={icon} />
            {tagGroup.map(({ id, name }) => (
              <span key={id}>{name}</span>
            ))}
          </TaskTagGroup>
        );
      })}
    </div>
  );
};

export default TaskTags;
