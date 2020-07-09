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

const wizardActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, {...wizardState})
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState)
  }),
  setFormData: action((state, payload) => {
    state.formData = {...state.formData, ...payload}
  }),
  setStep: action((state, payload) => {
    state.step = payload
  }),
  loadWizardData: thunk(async (actions, { wizardName }) => {
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

export const createTaskWizardModel = { ...wizardState, ...{wizardName: "createTaskWizard"}, ...wizardActions }
// export const completeTastWizardModel = { ...wizardState, ...{wizardName: "completeTaskWizard"}, ...wizardActions }
