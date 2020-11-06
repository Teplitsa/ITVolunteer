import { ReactElement } from "react";
import MemberAccountEmptySection from "./MemberAccountEmptySection";

const MemberAccountEmptyServiceShow: React.FunctionComponent = (): ReactElement => {
  return (
    <MemberAccountEmptySection
      title="Витрина услуг"
      text="Добавьте ваши ключевые услуги.
Расскажите заказчику, что вы умеете лучше всего!"
      linkUrl="/task-actions"
      linkCaption="Добавить услугу"
    />
  );
};

export default MemberAccountEmptyServiceShow;
