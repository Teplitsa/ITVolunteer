import { action, thunk } from "easy-peasy";
import {
  IFetchResult,
  IStoreModel,
} from "./model.typing";
import * as utils from "../utilities/utilities"
import * as _ from "lodash"

const storeJsLocalStorage = require('store')

const wizardState = {
  wizardName: "",
  formData: {},
  step: 0,
};

const createTaskWizardActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState)
  }),
  setFormData: action((state, payload) => {
    state.formData = {...state.formData, ...payload}
  }),
  setStep: action((state, payload) => {
    state.step = payload
  }),
  loadWizardData: thunk(async (actions, _miss, {getStoreState}) => {
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
  saveWizardData: action((state) => {
    storeJsLocalStorage.set('wizard.' + state.wizardName + '.data', {
      formData: state.formData,
      step: state.step,
    })
  }),
};

const completeTaskWizardActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState)
  }),
  setFormData: action((state, payload) => {
    state.formData = {...state.formData, ...payload}
  }),
  setStep: action((state, payload) => {
    state.step = payload
  }),
  loadWizardData: thunk(async (actions, _miss, {getStoreState}) => {
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
  saveWizardData: action((state) => {
    storeJsLocalStorage.set('wizard.' + state.wizardName + '.data', {
      formData: state.formData,
      step: state.step,
    })
  }),
};

const createTaskWizardState = {...wizardState, ...{wizardName: "createTaskWizard"}}
const completeTaskWizardState = {...wizardState, ...{wizardName: "completeTaskWizard"}}

export const createTaskWizardModel = { ...createTaskWizardState, ...createTaskWizardActions }
export const completeTaskWizardModel = { ...completeTaskWizardState, ...completeTaskWizardActions }
