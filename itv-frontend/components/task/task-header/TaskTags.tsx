import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import IconTags from "../../../assets/img/icon-color-picker.svg";
import IconNgoTags from "../../../assets/img/icon-people.svg";
import IconRewardTags from "../../../assets/img/icon-gift-box.svg";
import TaskTagGroup from "./TaskTagGroup";
import { capitalize, toCamelCase } from "../../../utilities/utilities";

function TaskTags(props) {
  const {
    tags: { nodes: tags },
    rewardTags: { nodes: rewardTags },
    ngoTaskTags: { nodes: ngoTags },
  } = props.task;

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
            {tagGroup.map(({ slug, name }) => {
              return (
                <span
                  key={`Tag${capitalize(groupId)}${capitalize(
                    toCamelCase(slug)
                  )}`}
                >
                  {name}
                </span>
              );
            })}
          </TaskTagGroup>
        );
      })}
    </div>
  );
}

export default TaskTags;
