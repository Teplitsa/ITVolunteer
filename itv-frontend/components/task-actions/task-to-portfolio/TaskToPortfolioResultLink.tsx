import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardStringField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const TaskToPortfolioResultLink = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "ResultLink",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={"Добавьте ссылку на результат, если она есть"}
          isRequired={false}
          {...props}
        >
          <WizardStringField
            {...props}
            name="resultLink"
            placeholder="http://ссылка на ваш результат"
            maxLength={50}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={props.bottomBarIcon} title={props.bottomBarTitle} />
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioResultLink;
