import {
  IModelWithAppAndEntrypoint,
  IPageState,
  PostType,
} from "../model.typing";
import { capitalize } from "../../utilities/utilities";

const pageModel = async (request, postType, pageQueryVars) => {
  const pageModel = await import("../page-model");
  const pageQuery = pageModel.graphqlQuery[`get${capitalize(postType)}BySlug`];
  const { [`${postType}By`]: page } = await request(
    process.env.GraphQLServer,
    pageQuery,
    pageQueryVars
  );

  return ["page", page];
};

const archiveModel = async (request, postType, archiveQueryVars) => {
  const archiveModel = await import("../archive-model");
  const archiveQuery =
    archiveModel.graphqlQuery[
      archiveQueryVars.searchPhrase
        ? `${postType}Search`
        : `get${capitalize(postType)}s`
    ];
  const { [`${postType}s`]: archive } = await request(
    process.env.GraphQLServer,
    archiveQuery,
    archiveQueryVars
  );

  if (postType === "task") {
    if (archiveQueryVars.searchPhrase) {
      Object.assign(archive, {
        seo: {
          canonical: encodeURI(
            `https://itivist.org/search?s=${archiveQueryVars.searchPhrase}`
          ),
          title: `Результаты поиска по запросу '${archiveQueryVars.searchPhrase}' - it-волонтер`,
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: `Результаты поиска по запросу '${archiveQueryVars.searchPhrase}' - it-волонтер`,
          opengraphUrl: `https://itivist.org/search?s=${archiveQueryVars.searchPhrase}`,
          opengraphSiteName: "it-волонтер",
        },
      });
    } else {
      Object.assign(archive, {
        seo: {
          canonical: "https://itivist.org/tasks",
          title: "Задачи - it-волонтер",
          opengraphTitle: "Задачи - it-волонтер",
          opengraphUrl: "https://itivist.org/tasks",
          opengraphSiteName: "it-волонтер",
        },
      });
    }
  }

  return ["archive", archive];
};

const withAppAndEntrypointModel = async ({
  isArchive = false,
  isCustomPage = false,
  customPageModel = async (): Promise<Array<string | IPageState>> => [
    "page",
    { slug: "" },
  ],
  entrypointQueryVars = null,
  entrypointType = "page" as PostType,
  componentModel,
}): Promise<IModelWithAppAndEntrypoint> => {
  const { request } = await import("graphql-request");

  const [entrypointTemplate, entrypointModel] = isArchive
    ? await archiveModel(request, entrypointType, entrypointQueryVars)
    : isCustomPage
    ? await customPageModel()
    : await pageModel(request, entrypointType, entrypointQueryVars);

  const componentData = isArchive
    ? {
        items: entrypointModel.edges.map(({ node: item }) => item),
      }
    : null;

  const [componentName, component] = await componentModel(
    request,
    componentData
  );

  const model = {
    app: {
      entrypointTemplate,
      now: Date.now(),
    },
    session: null,
    entrypointType,
    entrypoint: {
      [entrypointTemplate]: entrypointModel,
    },
    [componentName]: component,
  };

  return model;
};

export default withAppAndEntrypointModel;
