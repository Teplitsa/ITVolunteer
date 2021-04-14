import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Error401 from "../../components/page/Error401";
import Error404 from "../../components/page/Error404";
import ManageTask from "../../components/task-actions/manage-task/ManageTask";
import GlobalScripts, { ISnackbarMessage } from "../../context/global-scripts";
import { getRestApiUrl, stripTags } from "../../utilities/utilities";
import * as utils from "../../utilities/utilities";
import { FileItem } from "../../components/UploadFileInput";
import { IRestApiResponse } from "../../model/model.typing";

const { SnackbarContext } = GlobalScripts;

const TaskUpdatePage: React.FunctionComponent<{ statusCode?: number }> = ({
  statusCode,
}): ReactElement => {
  if (statusCode === 401) {
    return (
      <>
        <DocumentHead />
        <Main>
          <Error401 />
        </Main>
      </>
    );
  }

  if (statusCode === 404) {
    return (
      <>
        <DocumentHead />
        <Main>
          <Error404 />
        </Main>
      </>
    );
  }

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <SnackbarContext.Consumer>
            {({ dispatch }) => {
              const addSnackbar = (message: ISnackbarMessage) => {
                dispatch({ type: "add", payload: { messages: [message] } });
              };
              const clearSnackbar = () => {
                dispatch({ type: "clear" });
              };
              return <ManageTask {...{ addSnackbar, clearSnackbar }} />;
            }}
          </SnackbarContext.Consumer>
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { task_slug },
  req,
  res,
}) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );
  const loggedIn = decodeURIComponent(req.headers.cookie).match(
    /wordpress_logged_in_[^=]+=([^|]+)/
  );

  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: "task-update",
        seo: {
          canonical: `https://itv.te-st.ru/task-update/${task_slug}`,
          title: "Редактирование задачи - IT-волонтер",
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: "Редактирование задачи - IT-волонтер",
          opengraphUrl: `https://itv.te-st.ru/task-update/${task_slug}`,
          opengraphSiteName: "IT-волонтер",
        },
      },
    ],
    componentModel: async () => {
      const { initManageTaskState } = await import("../../model/task-model/manage-task-model");

      const componentData = { ...initManageTaskState };

      try {
        const requestURL = new URL(getRestApiUrl("/wp/v2/tasks/"));

        requestURL.search = (() => {
          return [`slug=${task_slug}`, "per_page=1"]
            .concat(
              [
                "id",
                "slug",
                "authorSlug",
                "title",
                "content",
                "tags",
                "ngo-tags",
                "rewards",
                "files",
                "preferredDuration",
              ].map(paramValue => `_fields[]=${paramValue}`)
            )
            .join("&");
        })();

        const rawResult = await utils.tokenFetch(requestURL.toString());

        const result = await rawResult.json();

        if (result instanceof Array) {
          if (result.length === 0) {
            res.statusCode = 404;
            return ["manageTask", null];
          } else if (
            !loggedIn ||
            result[0].authorSlug.toLowerCase() !== loggedIn[1].toLowerCase()
          ) {
            res.statusCode = 401;
            return ["manageTask", null];
          }
        }

        const {
          id,
          slug,
          title: { rendered: title },
          content: { rendered: description },
          tags,
          "ngo-tags": ngoTags,
          files,
          rewards,
          preferredDuration,
          data,
        } = (result as Array<{
          id: number;
          slug: string;
          authorSlug: string;
          title: { rendered: string };
          content: { rendered: string };
          tags: Array<number>;
          "ngo-tags": Array<number>;
          files: Array<number>;
          rewards: Array<number>;
          preferredDuration: string;
          data?: { status: number };
        }>)[0];

        if (data?.status && data.status !== 200) {
          console.error("При загрузке данных задачи произошла ошибка.");
        } else {
          const extendedFiles: Array<FileItem> = [];

          for (const fileId of files) {
            const mediaResult = await utils.tokenFetch(
              getRestApiUrl(`/wp/v2/media/${fileId}/?_fields[]=id&_fields[]=source_url`)
            );

            const mediaResponse: IRestApiResponse & {
              id: number;
              source_url: string;
            } = await mediaResult.json();

            if (mediaResponse.data?.status && mediaResponse.data.status !== 200) {
              console.error(
                `HTTP ${mediaResponse.data.status} При загрузке данных медиа-объекта произошла ошибка.`
              );
            } else {
              const { id: value, source_url: fileName } = mediaResponse;

              extendedFiles.push({ value, fileName });
            }
          }

          Object.assign(componentData, {
            id,
            slug,
            formData: {
              agreement: {
                simpleTask: true,
                socialProblem: true,
                effectiveCooperation: true,
                beInTouch: true,
                personalDataSecurity: true,
              },
              title: stripTags(title).trim(),
              description: stripTags(description).trim(),
              taskTags: { value: tags },
              ngoTags: {
                index: -1,
                value: String(ngoTags[0] ?? ""),
              },
              reward: {
                index: -1,
                value: String(rewards[0] ?? ""),
              },
              files: extendedFiles,
              preferredDuration,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }

      return ["manageTask", componentData];
    },
  });

  return {
    props: { statusCode: res.statusCode, ...model },
  };
};

export default TaskUpdatePage;
