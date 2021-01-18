import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";

const TaskNoCandidatesText: React.FunctionComponent = (): ReactElement => {
  const { doers, approvedDoer } = useStoreState(state => state.components.task);

  if(approvedDoer || doers?.length) {
    return null;
  }

  return (
    <h2>Откликов пока нет</h2>
  );
};

export default TaskNoCandidatesText;
