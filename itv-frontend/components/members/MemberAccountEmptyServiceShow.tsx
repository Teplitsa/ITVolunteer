import { ReactElement, SyntheticEvent, useRef } from "react";
import Link from "next/link";
import { useStoreActions } from "../../model/helpers/hooks";
import MemberAccountEmptySection from "./MemberAccountEmptySection"

const MemberAccountEmptyServiceShow: React.FunctionComponent = (): ReactElement => {
  return <MemberAccountEmptySection 
    title="Витрина услуг"
    text="Добавьте ваши ключевые услуги.
Расскажите заказчику, что вы умеете лучше всего!"
    linkUrl="/task-actions"
    linkCaption="Добавить услугу"
  />
};

export default MemberAccountEmptyServiceShow;
