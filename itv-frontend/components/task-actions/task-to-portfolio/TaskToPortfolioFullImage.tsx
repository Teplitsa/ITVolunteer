import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardUploadImageField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const TaskToPortfolioFullImage = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "FullImage",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={"Добавьте изображение в портфолио"}
          isRequired={false}
          {...props}
        >
          <WizardUploadImageField {...props} isMultiple={false} name="fullImage" />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={props.bottomBarIcon} title={props.bottomBarTitle} />
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioFullImage;
