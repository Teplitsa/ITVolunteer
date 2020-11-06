import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import {
  WizardScreen,
  WizardForm,
  WizardTextField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const CompleteTaskReview = (screenProps): ReactElement => {
  const isAuthor = useStoreState(state => state.components.completeTaskWizard.user.isAuthor);
  const props = {
    ...screenProps,
    screenName: "Review",
    onNextClick: () => {
      props.onWizardComplete();
      props.setStep(props.step + 1);
    },
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={isAuthor ? "Оставьте ваш отзыв о волонтере" : "Оставьте ваш отзыв о заказчике"}
          isRequired={true}
          {...props}
        >
          <WizardTextField
            {...props}
            name="reviewText"
            placeholder="Опишите, как проходила работа над задачей, как вы общались с волонтером"
            maxLength={250}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} />
      </div>
    </WizardScreen>
  );
};

export default CompleteTaskReview;
