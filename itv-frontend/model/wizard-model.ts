import { action, thunk, computed } from "easy-peasy";
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
  ITaskToPortfolioWizardModel,
  ITaskToPortfolioWizardState,
  ITaskToPortfolioWizardActions,
  ITaskToPortfolioWizardThunks,
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
  formFieldPlaceholders: {},
  getRandomPlaceholder: computed([state => state.formFieldPlaceholders], userId => Boolean(userId)),
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
  resetWizard: action(state => {
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
  setFormFieldPlaceholders: action((state, payload) => {
    state.formFieldPlaceholders = payload;
  }),
};

const createTaskWizardThunks: ICreateTaskWizardThunks = {
  loadWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        createTaskWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    const wizardData = await storeJsLocalStorage.get("wizard." + wizardName + ".data");
    if (wizardData) {
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
  loadTaxonomyData: thunk(async actions => {
    const action = "get-task-taxonomy-data";

    fetch(utils.getAjaxUrl(action), {
      method: "post",
    })
      .then(res => {
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
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }),
  formFieldPlaceholdersRequest: thunk(async actions => {
    const route = "/itv/v1/task/form-placeholders";
    console.log("formFieldPlaceholdersRequest:", utils.getRestApiUrl(route));

    fetch(utils.getRestApiUrl(route), {
      method: "get",
    })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: any) => {
          actions.setFormFieldPlaceholders(result);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }),
};

const completeTaskWizardState: ICompleteTaskWizardState = {
  ...wizardState,
  ...{
    wizardName: "completeTaskWizard",
    user: {
      databaseId: 0,
      name: "",
      isAuthor: false,
    },
    partner: {
      databaseId: 0,
      name: "",
    },
    task: {
      databaseId: 0,
      title: "",
    },
  },
};

const completeTaskWizardActions: ICompleteTaskWizardActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setInitState: action((prevState, { user, partner, task }) => {
    Object.assign(prevState, { user, partner, task });
  }),
  setFormData: action((state, payload) => {
    state.formData = { ...state.formData, ...payload };
  }),
  setStep: action((state, payload) => {
    state.step = payload;
  }),
  resetFormData: action(state => {
    state.formData = {};
  }),
  resetStep: action(state => {
    state.step = 0;
  }),
  resetWizard: action(state => {
    state.partner = {
      databaseId: 0,
      name: "",
    };
    state.task = {
      databaseId: 0,
      title: "",
    };
    state.user = {
      databaseId: 0,
      name: "",
      isAuthor: false,
    };
  }),
  setWizardName: action((state, payload) => {
    state.wizardName = payload;
  }),
  setNeedReset: action((state, payload) => {
    state.isNeedReset = payload;
  }),
};

const completeTaskWizardThunks: ICompleteTaskWizardThunks = {
  loadWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        completeTaskWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    const wizardData = storeJsLocalStorage.get(`wizard.${wizardName}.data`);
    if (wizardData) {
      actions.setInitState({
        user: wizardData.user ?? {},
        partner: wizardData.partner ?? {},
        task: wizardData.task ?? {},
      });
      actions.setFormData(wizardData.formData ?? {});
      actions.setStep(wizardData.step ?? 0);
      actions.setNeedReset(wizardData.isNeedReset ?? false);
    }
  }),
  saveWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        completeTaskWizard: { wizardName, formData, step, user, partner, task, isNeedReset },
      },
    } = getStoreState() as IStoreModel;
    storeJsLocalStorage.set(`wizard.${wizardName}.data`, {
      formData,
      step,
      user,
      partner,
      task,
      isNeedReset,
    });
  }),
  removeWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        completeTaskWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    storeJsLocalStorage.remove(`wizard.${wizardName}.data`);
  }),
  newReviewRequest: thunk(
    async (actions, { user, partner, task, reviewRating, communicationRating, reviewText }) => {
      const formData = new FormData();
      formData.append("review-rating", String(reviewRating));
      formData.append("communication-rating", String(communicationRating));
      formData.append("review-message", reviewText);
      formData.append("task-id", String(task.databaseId));

      let action = "";

      if (user.isAuthor) {
        action = "leave-review";
        formData.append("doer-id", String(partner.databaseId));
      } else {
        action = "leave-review-author";
        formData.append("author-id", String(partner.databaseId));
      }

      try {
        const result = await fetch(utils.getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, message: responseMessage } = await (<
          Promise<{
            status: string;
            message?: string;
          }>
        >result.json());
        if (responseStatus === "fail") {
          console.error(utils.stripTags(responseMessage));
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const taskToPortfolioWizardState: ITaskToPortfolioWizardState = {
  ...wizardState,
  ...{
    wizardName: "taskToPortfolio",
    doer: {
      databaseId: 0,
      name: "",
    },
    task: {
      databaseId: 0,
      title: "",
    },
  },
};

const taskToPortfolioWizardActions: ITaskToPortfolioWizardActions = {
  ...completeTaskWizardActions,
  ...{
    setInitState: action((prevState, { doer, task }) => {
      Object.assign(prevState, { doer, task });
    }),
    resetFormData: action(state => {
      state.formData = {};
    }),
    resetStep: action(state => {
      state.step = 0;
    }),
    resetWizard: action(state => {
      state.doer = {
        databaseId: 0,
        name: "",
      };
      state.task = {
        databaseId: 0,
        title: "",
      };
    }),
  },
};

const taskToPortfolioWizardThunks: ITaskToPortfolioWizardThunks = {
  loadWizardData: thunk(
    async ({ setInitState, setFormData, setStep, setNeedReset }, payload, { getStoreState }) => {
      const {
        components: {
          taskToPortfolioWizard: { wizardName },
        },
      } = getStoreState() as IStoreModel;
      const { doer, task, formData, step, isNeedReset } =
        storeJsLocalStorage.get(`wizard.${wizardName}.data`) ?? {};

      setInitState({
        doer: doer ?? {},
        task: task ?? {},
      });
      setFormData(formData ?? {});
      setStep(step ?? 0);
      setNeedReset(isNeedReset ?? false);
    }
  ),
  saveWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        taskToPortfolioWizard: { wizardName, formData, step, doer, task, isNeedReset },
      },
    } = getStoreState() as IStoreModel;
    storeJsLocalStorage.set(`wizard.${wizardName}.data`, {
      formData,
      step,
      doer,
      task,
      isNeedReset,
    });
  }),
  removeWizardData: thunk(async (actions, payload, { getStoreState }) => {
    const {
      components: {
        taskToPortfolioWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    storeJsLocalStorage.remove(`wizard.${wizardName}.data`);
  }),
  newPortfolioItemRequest: thunk(
    async (actions, { doer, task, title, description, demoLink, preview, fullImage }) => {
      try {
        // TODO
        return { doer, task, title, description, demoLink, preview, fullImage };
      } catch (error) {
        console.error(error);
      }
    }
  ),
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

export const taskToPortfolioWizardModel: ITaskToPortfolioWizardModel = {
  ...taskToPortfolioWizardState,
  ...taskToPortfolioWizardActions,
  ...taskToPortfolioWizardThunks,
};
