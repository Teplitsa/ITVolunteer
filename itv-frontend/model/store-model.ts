import appModel from "./app-model";
import sessionModel from "./session-model";
import archiveModel from "./archive-model";
import pageModel from "./page-model";
import componentsModel from "./components-model";
import { IStoreModel } from "./model.typing";

const storeModel: IStoreModel = {
  app: appModel,
  session: sessionModel,
  entrypoint: {
    archive: archiveModel,
    page: pageModel,
  },
  components: componentsModel,
};

export default storeModel;
