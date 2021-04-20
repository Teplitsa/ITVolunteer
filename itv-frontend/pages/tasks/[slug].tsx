import { ReactElement, memo, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { authorizeSessionSSRFromRequest } from "../../model/session-model";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Task from "../../components/task/Task";
import TaskComments from "../../components/task/TaskComments";
import TaskSuggestionsForVolonteers from "../../components/task/TaskSuggestionsForVolonteers";
import TaskFooterCTA from "../../components/task/TaskFooterCTA";
import TaskAuthor from "../../components/task/author/TaskAuthor";
import TaskBecomeCandidate from "../../components/task/TaskBecomeCandidate";
import TaskCancelCandidate from "../../components/task/TaskCancelCandidate";
import TaskNoCandidatesText from "../../components/task/TaskNoCandidatesText";
import TaskReplyStatus from "../../components/task/TaskReplyStatus";
import TaskApprovedDoer from "../../components/task/TaskApprovedDoer";
import TaskVolonteerFeedback from "../../components/task/TaskVolonteerFeedback";
import TaskAdminSupport from "../../components/task/TaskAdminSupport";
import Sidebar from "../../components/layout/partials/Sidebar";
import { ITaskState } from "../../model/model.typing";
import { graphqlQuery as graphqlTaskQuery } from "../../model/task-model/task-model";
import { regEvent } from "../../utilities/ga-events";
import * as utils from "../../utilities/utilities";

const TaskPage: React.FunctionComponent<ITaskState> = (task): ReactElement => {
  const { isLoggedIn } = useStoreState(state => state.session);
  const { ...taskState } = useStoreState(state => state.components.task);
  const setTaskState = useStoreActions(actions => actions.components.task.setState);
  const setCrumbs = useStoreActions(actions => actions.components.breadCrumbs.setCrumbs);
  const router = useRouter();
  const { slug } = router.query;

  // useEffect(() => {
  //   setTaskState(task);
  // }, [task]);

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  // useEffect(() => {
  //   // console.log("input:", task.databaseId, slug, isLoggedIn)

  //   if (task.databaseId || !slug || !isLoggedIn) {
  //     return;
  //   }

  //   import("graphql-request").then(async ({ GraphQLClient }) => {
  //     const graphQLClient = new GraphQLClient(process.env.GraphQLServer, { headers: utils.getGraphQLClientTokenHeader(session) });

  //     try {
  //       const { task } = await graphQLClient.request(graphqlTaskQuery.getBySlug, {
  //         taskSlug: String(slug),
  //       });
  //       setTaskState(task);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   });
  // }, [slug, task, isLoggedIn]);

  useEffect(() => {
    setCrumbs([
      {title: "Задачи", url: "/tasks"},
      {title: task.title},
    ]);  
  }, [task]);

  return (
    <>
      <DocumentHead />
      <Main>
        {taskState.id && taskState.databaseId && (
          <main id="site-main" className="site-main page-task" role="main">
            <section className="content">
              <h2>Задача</h2>
              <Task />
              <TaskFooterCTA />
              <TaskComments />
              <TaskSuggestionsForVolonteers />
            </section>
            <Sidebar>
              <TaskAuthor />
              <TaskNoCandidatesText />
              <TaskCancelCandidate />
              <TaskReplyStatus />
              <TaskApprovedDoer />
              <TaskVolonteerFeedback />
              <TaskBecomeCandidate />
              <TaskAdminSupport buttonTitle="Что-то не так с задачей? Напишите администратору" />
            </Sidebar>
          </main>
        )}
        {!taskState.id && (
          <main id="site-main" className="site-main page-task" role="main">
            <section className="content">
              <h2>Задача не найдена!</h2>
            </section>
          </main>
        )}
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params: { slug } }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );

  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { slug },
    entrypointType: "task",
    componentModel: async request => {
      const taskModel = await import("../../model/task-model/task-model");
      const taskQuery = taskModel.graphqlQuery.getBySlug;

      const session = await authorizeSessionSSRFromRequest(req, res);
      const { GraphQLClient } = await import("graphql-request");
      const graphQLClient = new GraphQLClient(process.env.GraphQLServer, { headers: utils.getGraphQLClientTokenHeader(session) });

      const { task: component } = await graphQLClient.request(taskQuery, {
        taskSlug: String(slug),
      });

      console.log("taskQuery: ", taskQuery.replace(/\n/g, " ").replace(/\s{2,}/g, " "));
      // console.log("task component: ", component);
  

      // const { task: component } = await request(process.env.GraphQLServer, taskQuery, {
      //   taskSlug: slug,
      // });

      return ["task", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default memo(TaskPage);
