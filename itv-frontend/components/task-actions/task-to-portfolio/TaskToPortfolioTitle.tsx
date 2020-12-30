import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardStringField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const TaskToPortfolioTitle = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Title",
    onNextClick: event => {
      event.preventDefault();
      props.goNextStep();
    },
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={"Под каким названием поставим задачу в портфолио"}
          isRequired={true}
          {...props}
        >
          <WizardStringField
            {...props}
            name="title"
            placeholder="Нужен сайт на Word Press для нашей организации"
            maxLength={150}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} />
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioTitle;
