import {
  WizardScreen,
  WizardScreenBottomBar,
  WizardStringField,
  WizardForm,
  WizardFormActionBar,
} from "../layout/WizardScreen";

export const CongratulationsScreen = screenProps => {
  const props = {
    ...screenProps,
    screenName: "CongratulationsScreen",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen agreement">
        <h1>Поздравляем с закрытием задачи!</h1>
        <WizardFormActionBar {...props} isAllowPrevButton={false} />
      </div>
    </WizardScreen>
  );
};

export const RateRequirementsQuality = screenProps => {
  const props = {
    ...screenProps,
    screenName: "RateRequirementsQuality",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm title="Насколько точно было составлено ТЗ" isRequired={false} {...props}>
          <WizardStringField {...props} name="requirementRating" />
        </WizardForm>
        <WizardScreenBottomBar {...props} />
      </div>
    </WizardScreen>
  );
};
