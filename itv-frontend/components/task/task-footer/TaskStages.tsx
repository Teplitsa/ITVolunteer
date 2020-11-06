import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";

const TaskStages: React.FunctionComponent = (): ReactElement => {
  const { status, reviewsDone } = useStoreState(state => state.components.task);

  const stageLabels: Array<string> = ["Публикация", "Поиск", "В работе", "Закрытие", "Отзывы"];
  const stageClassList: Array<string> = Array(5).fill("stage");
  const classSwitchLogics = [
    {
      active: status == "draft",
      done: ["closed", "in_work", "publish"].includes(status),
    },
    {
      active: status == "publish",
      done: ["closed", "in_work"].includes(status),
    },
    {
      active: status === "in_work",
      done: status === "closed",
    },
    {
      active: false,
      done: status === "closed",
    },
    {
      active: status === "closed",
      done: status === "closed" && reviewsDone,
    },
  ];

  let stage: { done: boolean; active: boolean };

  while ((stage = classSwitchLogics.pop())) {
    const i = classSwitchLogics.length;

    if (stage.done) {
      stageClassList[i] += " done";
    } else if (stage.active) {
      stageClassList[i] += " active";
    }
  }

  return (
    <div className="stages">
      <h3>Этапы</h3>
      <div className="stages-list">
        {stageClassList.map((classList, i) => {
          const isLast: boolean = stageClassList.length - i === 1;
          return (
            <div key={stageLabels[i]} className={`${classList}${(isLast && " last") || ""}`}>
              <i>{i + 1}</i>
              {stageLabels[i]}
              {isLast && <b className="finish-flag" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskStages;
