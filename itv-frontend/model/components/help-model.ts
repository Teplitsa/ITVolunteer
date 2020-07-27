import { action, thunk, thunkOn, computed } from "easy-peasy";
import {
  IStoreModel,
  IHelpPageState,
  IHelpPageActions,
  IHelpPageThunks,
} from "../model.typing";
import * as _ from "lodash";

const helpPageState: IHelpPageState = {
  id: "",
  databaseId: 0,
  title: "",
  slug: "",
  content: "",
  status: "",
  helpCategories: null,
};

export const queriedFields = Object.entries(helpPageState).reduce(
  (fields, [fieldKey, fieldValue]) => {
    if(!Object.is(fieldValue, null)) {
      fields.push(fieldKey);
    }
    return fields;
  },
  []
) as Array<keyof IHelpPageState>;

export const graphqlHelpCategories  = `
  helpCategories {
    nodes {
      id
      databaseId
      name
      slug
    }
  }
`;

export const graphqlQuery = {
  getBySlug: `
  query Help($taskSlug: ID!) {
    help(id: $taskSlug, idType: SLUG) {
      
      ${queriedFields.join("\n")}

      ${graphqlHelpCategories}

    }
  }`,
};

const helpPageActions: IHelpPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, helpPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const helpPageThunks: IHelpPageThunks = {
  helpPageRequest: thunk(async ({ setState }, helpPageSlug, { getStoreState }) => {
    const {
      session: { validToken: token },
    } = getStoreState() as IStoreModel;

    import("graphql-request").then(async ({ GraphQLClient }) => {
      const getTaskStateQuery = graphqlQuery.getBySlug;
      const graphQLClient = new GraphQLClient(process.env.GraphQLServer, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      try {
        const { help } = await graphQLClient.request(getTaskStateQuery, {
          taskSlug: String(helpPageSlug),
        });
        
        setState(help);

      } catch (error) {
        console.error(error.message);
      }
    });
  }),
};

const helpPageModel = { ...helpPageState, ...helpPageActions, ...helpPageThunks };

export default helpPageModel;

