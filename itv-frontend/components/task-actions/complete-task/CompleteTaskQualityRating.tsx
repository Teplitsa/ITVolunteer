import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import {
  WizardScreen,
  WizardForm,
  WizardRating,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";
import bottomIcon from "../../../assets/img/icon-task-list-gray.svg";

const CompleteTaskQualityRating = (screenProps): ReactElement => {
  const isAuthor = useStoreState(state => state.components.completeTaskWizard.user.isAuthor);
  const taskTitle = useStoreState(state => state.components.completeTaskWizard.task.title);
  const props = {
    ...screenProps,
    screenName: "ReviewRating",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={
            isAuthor ? "Оцените качество выполнения задачи" : "Насколько точно было составлено ТЗ"
          }
          isRequired={true}
          {...props}
        >
          <WizardRating {...props} name="reviewRating" />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title={isAuthor ? taskTitle : null} />
      </div>
    </WizardScreen>
  );
};

export default CompleteTaskQualityRating;
