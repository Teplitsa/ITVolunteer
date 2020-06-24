import { createTypedHooks } from "easy-peasy";
import { IStoreModel } from "../model.typing";

export const {
  useStoreState,
  useStoreActions,
  useStoreDispatch,
} = createTypedHooks<IStoreModel>();
