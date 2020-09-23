import { ReactElement } from "react";
import Link from "next/link";
import { ITaskTag } from "../../../model/model.typing";
import IconTags from "../../../assets/img/icon-color-picker.svg";
import IconNgoTags from "../../../assets/img/icon-people.svg";
import IconRewardTags from "../../../assets/img/icon-gift-box.svg";
import TaskTagGroup from "./TaskTagGroup";
import { capitalize, toCamelCase } from "../../../utilities/utilities";

const TaskTags: React.FunctionComponent<{
  tags?: {
    nodes: Array<ITaskTag>;
  };
  rewardTags?: {
    nodes: Array<ITaskTag>;
  };
  ngoTaskTags?: {
    nodes: Array<ITaskTag>;
  };
}> = ({ tags, rewardTags, ngoTaskTags: ngoTags }): ReactElement => {
  const tagGroups = [];

  tags?.nodes?.length && tagGroups.push(["tags", IconTags, tags.nodes]);
  ngoTags?.nodes?.length &&
    tagGroups.push(["ngoTags", IconNgoTags, ngoTags.nodes]);
  rewardTags?.nodes?.length &&
    tagGroups.push(["rewardTags", IconRewardTags, rewardTags.nodes]);

  return (
    <div className="meta-terms">
      {tagGroups.map(([groupId, icon, tagGroup]) => {
        // console.log("groupId:", groupId);
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
                  {groupId === 'tags' &&
                  <Link href="/tasks/tag/[slug]" as={`/tasks/tag/${slug}`}><a>{name}</a></Link>
                  }
                  {groupId === 'ngoTags' &&
                  <Link href="/tasks/nko-tag/[slug]" as={`/tasks/nko-tag/${slug}`}><a>{name}</a></Link>
                  }
                  {groupId !== 'ngoTags' && groupId !== 'tags' &&
                    <>{name}</>
                  }
                </span>
              );
            })}
          </TaskTagGroup>
        );
      })}
    </div>
  );
};

export default TaskTags;
