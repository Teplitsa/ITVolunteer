import { createContext } from "react";
import { IHomeTaskListContext } from "../../model/model.typing";

export const homeTaskListContextDefault: IHomeTaskListContext = { 
    mustHideTaskItemOverlays: {},
    setMustHideTaskItemOverlays: () => {},
 };
export const HomeTaskListContext = createContext(homeTaskListContextDefault);
