import { ReactElement, useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ITaskTag } from "../../../model/model.typing";
import IconTags from "../../../assets/img/icon-filter-tiles.svg";
import IconNgoTags from "../../../assets/img/icon-filter-fire.svg";
import IconRewardTags from "../../../assets/img/icon-gift-box.svg";
import TaskTagGroup from "./TaskTagGroup";
import { capitalize, toCamelCase } from "../../../utilities/utilities";
import { regEvent } from "../../../utilities/ga-events";
import { HomeTaskListContext } from "../../task-list/TaskListContext";

const TaskTagsHome: React.FunctionComponent<{
  id: string,
  tags?: {
    nodes: Array<ITaskTag>;
  };
  rewardTags?: {
    nodes: Array<ITaskTag>;
  };
  ngoTaskTags?: {
    nodes: Array<ITaskTag>;
  };
}> = ({ tags, rewardTags, ngoTaskTags: ngoTags, id: taskId }): ReactElement => {
  const router = useRouter();
  const tagGroups: Array<[string, string, string, Array<ITaskTag>, string]> = [];

  tags?.nodes?.length && tagGroups.push(["tags", "tag", IconTags, tags.nodes, "tl_tf_tags"]);
  ngoTags?.nodes?.length &&
    tagGroups.push(["ngoTags", "nko-tag", IconNgoTags, ngoTags.nodes, "tl_tf_nko_tags"]);
  rewardTags?.nodes?.length &&
    tagGroups.push(["rewardTags", "", IconRewardTags, rewardTags.nodes, ""]);

  const [mustShowAllTermsOverlay, setMustShowAllTermsOverlay] = useState(getMustShowAllTermsOverlayConfig(null));
  const homeTaskListContext = useContext(HomeTaskListContext);

  useEffect(() => {
    if(homeTaskListContext.mustHideTaskItemOverlays[taskId]) {
      setMustShowAllTermsOverlay(false);
      homeTaskListContext.setMustHideTaskItemOverlays(taskId, false);
    }
  }, [homeTaskListContext]);

  function getMustShowAllTermsOverlayConfig(showGroupId) {
    return tagGroups.reduce(
      (prevObject, [groupId]) => {
        prevObject[groupId] = groupId === showGroupId;
        return prevObject;
      }, {}
    );
  }

  return (
    <div className="meta-terms">
      <div className="meta-terms__left-column">
        {tagGroups.map(
          ([groupId, groupSlug, icon, tagGroup, regEventName]) =>
            ["tags", "ngoTags"].includes(groupId) && (
              <TaskTagGroup key={groupId}>
                <img src={icon} onClick={() =>{
                  setMustShowAllTermsOverlay(getMustShowAllTermsOverlayConfig(null));
                }} />
                {tagGroup.slice(0, 1).map(({ slug, name }) => (
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
                {tagGroup.length > 1 &&
                  <div className={`meta-term plus-some ${mustShowAllTermsOverlay[groupId] && "invisible"}`}>
                    <a
                      href="#"
                      className="link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMustShowAllTermsOverlay(getMustShowAllTermsOverlayConfig(groupId));
                      }}
                    >
                      {`+${tagGroup.length - 1}`}
                    </a>
                  </div>
                }
                {mustShowAllTermsOverlay[groupId] && <div className="all-terms-overlay" onClick={() =>{
                      setMustShowAllTermsOverlay({...mustShowAllTermsOverlay, [groupId]: false});
                  }}>
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
                </div>}
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
                  <div className="meta-term" key={slug} title={name}>
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

export default TaskTagsHome;
