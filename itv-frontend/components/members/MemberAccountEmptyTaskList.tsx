import { ReactElement } from "react";
import MemberAccountEmptySection from "./MemberAccountEmptySection";

const MemberAccountEmptyTaskList: React.FunctionComponent = (): ReactElement => {
  return (
    <MemberAccountEmptySection
      title="Задачи"
      text="Здесь будут собраны все созданные вами задачи или все задачи, которые вы решаете.
Возможно, стоит создать свою первую задачу?"
      linkUrl="/task-actions"
      linkCaption="Создать задачу"
    />
  );
};

export default MemberAccountEmptyTaskList;
