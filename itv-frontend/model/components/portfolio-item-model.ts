import {
  IStoreModel,
  IPortfolioItemModel,
  IPortfolioItemState,
  IPortfolioItemActions,
  IPortfolioItemThunks,
  IRestApiResponse,
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { portfolioItemFormState } from "./portfolio-model";
import { getRestApiUrl } from "../../utilities/utilities";
import * as utils from "../../utilities/utilities";

export const portfolioItemState: IPortfolioItemState = {
  author: {
    id: 0,
    slug: "",
    name: "",
    fullName: "",
    itvAvatar: "",
    authorReviewsCount: 0,
    doerReviewsCount: 0,
    reviewsCount: 0,
    rating: 0,
    xp: 0,
    itvRole: "doer",
    itvRoleTitle: "Волонтер",
  },
  item: portfolioItemFormState,
};

const portfolioItemActions: IPortfolioItemActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, portfolioItemState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const portfolioItemThunks: IPortfolioItemThunks = {
  deletePortfolioItemRequest: thunk(
    async (_, { successCallbackFn, errorCallbackFn }, { getStoreState }) => {
      const {
        session: {
          user: { databaseId: userId },
          validToken: token,
        },
        components: {
          portfolioItem: {
            author: { id: authorId },
            item: { slug: portfolioItemSlug },
          },
        },
      } = getStoreState() as IStoreModel;

      if (userId !== authorId) {
        console.error("У пользователя недостаточно прав для совершения данной операции.");
        return;
      }

      try {
        const result = await utils.tokenFetch(
          getRestApiUrl(`/wp/v2/portfolio_work/slug:${portfolioItemSlug}`),
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth_token: token,
              author: authorId,
            }),
          }
        );

        const { data } = await (<Promise<IRestApiResponse>>result.json());
        if (data?.status && data.status !== 200) {
          console.error("При удалении портфолио произошла ошибка.");
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

const portfolioItemModel: IPortfolioItemModel = {
  ...portfolioItemState,
  ...portfolioItemActions,
  ...portfolioItemThunks,
};

export default portfolioItemModel;
