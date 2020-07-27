import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardTextField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const CompleteTaskReview = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Review",
    onNextClick: () => {
      props.setStep(props.step + 1);
    },
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Оставьте ваш отзыв о волонтере"
          isRequired={false}
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
