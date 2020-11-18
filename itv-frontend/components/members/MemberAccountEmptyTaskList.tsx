import { ReactElement } from "react";
import MemberAccountEmptySection from "./MemberAccountEmptySection";

const MemberAccountEmptyTaskList: React.FunctionComponent = (): ReactElement => {
  return (
    <MemberAccountEmptySection
      title="Задачи"
      text="Здесь будут собраны все созданные вами задачи.<br />Возможно, стоит создать свою первую задачу?"
      linkUrl="/task-actions"
      linkCaption="Создать новую задачу"
    />
  );
};

export default MemberAccountEmptyTaskList;
