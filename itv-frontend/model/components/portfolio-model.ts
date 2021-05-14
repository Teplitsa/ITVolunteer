import {
  IStoreModel,
  IPortfolioItemFormModel,
  IPortfolioItemFormState,
  IPortfolioItemFormActions,
  IPortfolioItemFormThunks,
  IRestApiResponse,
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { getRestApiUrl } from "../../utilities/utilities";
import * as utils from "../../utilities/utilities";

export const portfolioItemFormState: IPortfolioItemFormState = {
  id: 0,
  slug: "",
  title: "",
  description: "",
  preview: 0,
  fullImage: 0,
  nextPortfolioItemSlug: "",
  prevPortfolioItemSlug: "",
};

const portfolioItemFormActions: IPortfolioItemFormActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, portfolioItemFormState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const portfolioItemFormThunks: IPortfolioItemFormThunks = {
  publishPortfolioItemRequest: thunk(
    async (_, { inputData, successCallbackFn, errorCallbackFn }, { getStoreState }) => {
      if (!inputData) return;

      const {
        session: {
          user: { databaseId: authorId },
          validToken: token,
        },
      } = getStoreState() as IStoreModel;

      const jsonData = Array.from(inputData).reduce(
        (jsonData, [name, value]) => {
          switch (name) {
          case "description":
            jsonData["content"] = value;
            break;
          case "preview":
            jsonData["featured_media"] = Number(value);
            break;
          case "full_image":
            jsonData["meta"] = {
              portfolio_image_id: Number(value),
            };
            break;
          default:
            jsonData[name] = value;
            break;
          }

          return jsonData;
        },
        {
          auth_token: token,
          status: "publish",
          author: authorId,
          context: "portfolio_edit"
        }
      );

      try {
        const result = await utils.tokenFetch(getRestApiUrl("/wp/v2/portfolio_work"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });

        const { data } = await (<Promise<IRestApiResponse>>result.json());
        if (data?.status && data.status !== 201) {
          console.error("При добавлении портфолио произошла ошибка.");
          errorCallbackFn && errorCallbackFn();
        } else {
          successCallbackFn && successCallbackFn();
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  updatePortfolioItemRequest: thunk(
    async (_, { slug, inputData, successCallbackFn, errorCallbackFn }, { getStoreState }) => {
      if (!inputData) return;

      const {
        session: {
          user: { databaseId: authorId },
          validToken: token,
        },
      } = getStoreState() as IStoreModel;

      const jsonData = Array.from(inputData).reduce(
        (jsonData, [name, value]) => {
          switch (name) {
          case "description":
            jsonData["content"] = value;
            break;
          case "preview":
            jsonData["featured_media"] = Number(value);
            break;
          case "full_image":
            jsonData["meta"] = {
              portfolio_image_id: Number(value),
            };
            break;
          default:
            jsonData[name] = value;
            break;
          }

          return jsonData;
        },
        {
          auth_token: token,
          status: "publish",
          author: authorId,
          context: "portfolio_edit"
        }
      );

      try {
        const result = await utils.tokenFetch(getRestApiUrl(`/wp/v2/portfolio_work/slug:${slug}`), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });

        const { data } = await (<Promise<IRestApiResponse>>result.json());
        if (data?.status && data.status !== 200) {
          console.error("При обновлении портфолио произошла ошибка.");
          errorCallbackFn && errorCallbackFn();
        } else {
          successCallbackFn && successCallbackFn();
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const portfolioItemFormModel: IPortfolioItemFormModel = {
  ...portfolioItemFormState,
  ...portfolioItemFormActions,
  ...portfolioItemFormThunks,
};

export default portfolioItemFormModel;
