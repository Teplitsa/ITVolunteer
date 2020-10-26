import { ReactElement, SyntheticEvent, useRef } from "react";
import Link from "next/link";
import { useStoreActions } from "../../model/helpers/hooks";
import MemberAccountEmptySection from "./MemberAccountEmptySection"

const MemberAccountEmptyTaskList: React.FunctionComponent = (): ReactElement => {
  return <MemberAccountEmptySection 
    title="Задачи"
    text="Здесь будут собраны все созданные вами задачи или все задачи, которые вы решаете.
Возможно, стоит создать свою первую задачу?"
    linkUrl="/task-actions"
    linkCaption="Создать задачу"
  />
};

export default MemberAccountEmptyTaskList;
