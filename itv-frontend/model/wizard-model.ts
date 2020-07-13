import { action, thunk } from "easy-peasy";
import * as _ from "lodash"
import moment from "moment"

import {
  IFetchResult,
  IStoreModel,
  IWizardActions,
  IWizardThunks,
  IWizardModel,
  IWizardState,
} from "./model.typing";
import * as utils from "../utilities/utilities"

const storeJsLocalStorage = require('store')

const wizardState: IWizardState = {
  wizardName: "",
  formData: {},
  step: 0,
  showScreenHelpModalState: {},
  now: moment(),
};

const createTaskWizardActions: IWizardActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState)
  }),
  setFormData: action((state, payload) => {
    state.formData = {...state.formData, ...payload}
  }),
  setStep: action((state, payload) => {
    state.step = payload
  }),
  setShowScreenHelpModalState: action((state, payload) => {
    state.showScreenHelpModalState = {...state.showScreenHelpModalState, ...payload}
  }),
};

const createTaskWizardThunks: IWizardThunks = {
  loadWizardData: thunk(async (actions, payload, {getStoreState}) => {
    const {
      components: {
        createTaskWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    const wizardData = storeJsLocalStorage.get('wizard.' + wizardName + '.data')
    if(!!wizardData) {
      actions.setFormData(_.get(wizardData, "formData", {}))
      actions.setStep(_.get(wizardData, "step", 0))
    }
  }),  
  saveWizardData: thunk(async (actions, payload, {getStoreState}) => {
    const {
      components: {
        createTaskWizard: state,
      },
    } = getStoreState() as IStoreModel;
    storeJsLocalStorage.set('wizard.' + state.wizardName + '.data', {
      formData: state.formData,
      step: state.step,
    })
  }),
}  

const completeTaskWizardActions: IWizardActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState)
  }),
  setFormData: action((state, payload) => {
    state.formData = {...state.formData, ...payload}
  }),
  setStep: action((state, payload) => {
    state.step = payload
  }),
  setShowScreenHelpModalState: action((state, payload) => {
    state.showScreenHelpModalState = {...state.showScreenHelpModalState, ...payload}
  }),
};

const completeTaskWizardThunks: IWizardThunks = {
  loadWizardData: thunk(async (actions, payload, {getStoreState}) => {
    const {
      components: {
        completeTaskWizard: { wizardName },
      },
    } = getStoreState() as IStoreModel;
    const wizardData = storeJsLocalStorage.get('wizard.' + wizardName + '.data')
    if(!!wizardData) {
      actions.setFormData(_.get(wizardData, "formData", {}))
      actions.setStep(_.get(wizardData, "step", 0))
    }
  }),  
  saveWizardData: thunk(async (actions, payload, {getStoreState}) => {
    const {
      components: {
        completeTaskWizard: state,
      },
    } = getStoreState() as IStoreModel;
    storeJsLocalStorage.set('wizard.' + state.wizardName + '.data', {
      formData: state.formData,
      step: state.step,
    })
  }),
}  

const createTaskWizardState = {...wizardState, ...{wizardName: "createTaskWizard"}}
const completeTaskWizardState = {...wizardState, ...{wizardName: "completeTaskWizard"}}

export const createTaskWizardModel = { ...createTaskWizardState, ...createTaskWizardActions, ...createTaskWizardThunks }
export const completeTaskWizardModel = { ...completeTaskWizardState, ...completeTaskWizardActions, ...completeTaskWizardThunks }
