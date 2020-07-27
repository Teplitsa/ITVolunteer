import { action, thunk } from "easy-peasy";
import * as _ from "lodash";
import moment from "moment";

import {
  IFetchResult,
  IStoreModel,
  IWizardState,
  ICreateTaskWizardState,
  ICreateTaskWizardActions,
  ICreateTaskWizardThunks,
  ICreateTaskWizardModel,
  ICompleteTaskWizardModel,
  ICompleteTaskWizardState,
  ICompleteTaskWizardActions,
  ICompleteTaskWizardThunks,
} from "./model.typing";
import * as utils from "../utilities/utilities";

import storeJsLocalStorage from "store";

const wizardState: IWizardState = {
  wizardName: "",
  formData: {},
  step: 0,
  showScreenHelpModalState: {},
  now: moment(),
  isNeedReset: false,
};

const createTaskWizardState: ICreateTaskWizardState = {
  ...wizardState,
  wizardName: "createTaskWizard",
  rewardList: [],
  taskTagList: [],
  ngoTagList: [],
  helpPageSlug: "",
};

const createTaskWizardActions: ICreateTaskWizardActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setFormData: action((state, payload) => {
    state.formData = { ...state.formData, ...payload };
  }),
  setStep: action((state, payload) => {
    state.step = payload;
  }),
  setShowScreenHelpModalState: action((state, payload) => {
    state.showScreenHelpModalState = {
      ...state.showScreenHelpModalState,
      ...payload,
    };
  }),
  setRewardList: action((state, payload) => {
    state.rewardList = payload;
  }),
  setTaskTagList: action((state, payload) => {
    state.taskTagList = payload;
  }),
  setNgoTagList: action((state, payload) => {
    state.ngoTagList = payload;
  }),
  resetWizard: action((state, payload) => {
    state.step = 0;
    state.formData = {};
  }),
  setNeedReset: action((state, payload) => {
    state.isNeedReset = payload;
  }),
  setWizardName: action((state, payload) => {
    state.wizardName = payload;
  }),
  setHelpPageSlug: action((state, payload) => {
    state.helpPageSlug = payload;
  }),
};

const createTaskWizardThunks: ICreateTaskWizardThunks = {
  loadWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        createTaskWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    const wizardData = await storeJsLocalStorage.get(
      "wizard." + wizardName + ".data"
    );
    if (!!wizardData) {
      // console.log("wizardData:", wizardData)
      actions.setFormData(_.get(wizardData, "formData", {}));
      actions.setStep(_.get(wizardData, "step", 0));
      actions.setNeedReset(_.get(wizardData, "isNeedReset", false));
    }
  }),
  saveWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: { createTaskWizard: state },
    } = getStoreState() as IStoreModel;
    await storeJsLocalStorage.set("wizard." + state.wizardName + ".data", {
      formData: state.formData,
      step: state.step,
      isNeedReset: state.isNeedReset,
    });
  }),
  loadTaxonomyData: thunk(async (actions, payload) => {
    let action = "get-task-taxonomy-data";

    fetch(utils.getAjaxUrl(action), {
      method: "post",
    })
      .then((res) => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "error") {
            return utils.showAjaxError({ message: "Ошибка!" });
          }

          actions.setTaskTagList(result.data.taskTagList);
          actions.setNgoTagList(result.data.ngoTagList);
          actions.setRewardList(result.data.rewardList);
        },
        (error) => {
          utils.showAjaxError({ action, error });
        }
      );
  }),
};

const completeTaskWizardState: ICompleteTaskWizardState = {
  ...wizardState,
  ...{
    wizardName: "completeTaskWizard",
    taskId: "",
    taskDatabaseId: 0,
  },
};

const completeTaskWizardActions: ICompleteTaskWizardActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setTaskId: action((prevState, newState) => {
    prevState.taskId = newState.taskId;
    prevState.taskDatabaseId = newState.taskDatabaseId;
  }),
  setFormData: action((state, payload) => {
    state.formData = { ...state.formData, ...payload };
  }),
  setStep: action((state, payload) => {
    state.step = payload;
  }),
  setShowScreenHelpModalState: action((state, payload) => {
    state.showScreenHelpModalState = {
      ...state.showScreenHelpModalState,
      ...payload,
    };
  }),
  resetWizard: action((state, payload) => {
    state.step = 0;
    state.formData = {};
  }),
  setNeedReset: action((state, payload) => {
    state.isNeedReset = payload;
  }),
  setWizardName: action((state, payload) => {
    state.wizardName = payload;
  }),
};

const completeTaskWizardThunks: ICompleteTaskWizardThunks = {
  loadWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        completeTaskWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    const wizardData = storeJsLocalStorage.get(
      "wizard." + wizardName + ".data"
    );
    if (!!wizardData) {
      actions.setFormData(_.get(wizardData, "formData", {}));
      actions.setStep(_.get(wizardData, "step", 0));
      actions.setNeedReset(_.get(wizardData, "isNeedReset", false));
    }
  }),
  saveWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        completeTaskWizard: { wizardName, formData, step, isNeedReset },
      },
    } = getStoreState() as IStoreModel;
    storeJsLocalStorage.set("wizard." + wizardName + ".data", {
      formData: formData,
      step: step,
      isNeedReset: isNeedReset,
    });
  }),
};

export const createTaskWizardModel: ICreateTaskWizardModel = {
  ...createTaskWizardState,
  ...createTaskWizardActions,
  ...createTaskWizardThunks,
};

export const completeTaskWizardModel: ICompleteTaskWizardModel = {
  ...completeTaskWizardState,
  ...completeTaskWizardActions,
  ...completeTaskWizardThunks,
};
