import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardUploadImageField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const TaskToPortfolioPreview = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Preview",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={"Добавьте изображение превью"}
          isRequired={false}
          {...props}
        >
          <WizardUploadImageField {...props} isMultiple={false} name="preview" />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={props.bottomBarIcon} title={props.bottomBarTitle} />
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioPreview;
