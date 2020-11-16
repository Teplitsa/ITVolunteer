import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ITaskTag } from "../../../model/model.typing";
import IconTags from "../../../assets/img/icon-filter-tiles.svg";
import IconNgoTags from "../../../assets/img/icon-filter-fire.svg";
import IconRewardTags from "../../../assets/img/icon-gift-box.svg";
import TaskTagGroup from "./TaskTagGroup";
import { capitalize, toCamelCase } from "../../../utilities/utilities";
import { regEvent } from "../../../utilities/ga-events";

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
  const router = useRouter();
  const tagGroups: Array<[string, string, string, Array<ITaskTag>, string]> = [];

  tags?.nodes?.length && tagGroups.push(["tags", "tag", IconTags, tags.nodes, "tl_tf_tags"]);
  ngoTags?.nodes?.length &&
    tagGroups.push(["ngoTags", "nko-tag", IconNgoTags, ngoTags.nodes, "tl_tf_nko_tags"]);
  rewardTags?.nodes?.length &&
    tagGroups.push(["rewardTags", "", IconRewardTags, rewardTags.nodes, ""]);

  return (
    <div className="meta-terms">
      <div className="meta-terms__left-column">
        {tagGroups.map(
          ([groupId, groupSlug, icon, tagGroup, regEventName]) =>
            ["tags", "ngoTags"].includes(groupId) && (
              <TaskTagGroup key={groupId}>
                <img src={icon} />
                {tagGroup.map(({ slug, name }) => (
                  <div className="meta-term" key={slug}>
                    <Link href={`/tasks/${groupSlug}/[slug]`} as={`/tasks/${groupSlug}/${slug}`}>
                      <a
                        key={`Tag${capitalize(groupId)}${capitalize(toCamelCase(slug))}`}
                        className="link"
                        title={name}
                        onClick={() => {
                          regEvent(regEventName, router);
                        }}
                      >
                        {name}
                      </a>
                    </Link>
                  </div>
                ))}
              </TaskTagGroup>
            )
        )}
      </div>
      <div className="meta-terms__right-column">
        {tagGroups.map(
          ([groupId, , icon, tagGroup]) =>
            groupId === "rewardTags" && (
              <TaskTagGroup key={groupId}>
                <img src={icon} />
                {tagGroup.map(({ slug, name }) => (
                  <div className="meta-term" key={slug}>
                    <span>{name}</span>
                  </div>
                ))}
              </TaskTagGroup>
            )
        )}
      </div>
    </div>
  );
};

export default TaskTags;
