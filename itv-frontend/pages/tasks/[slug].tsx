import { ReactElement, memo, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Task from "../../components/task/Task";
import TaskComments from "../../components/task/TaskComments";
import TaskSuggestionsForVolonteers from "../../components/task/TaskSuggestionsForVolonteers";
import TaskAuthor from "../../components/task/author/TaskAuthor";
import TaskBecomeCandidate from "../../components/task/TaskBecomeCandidate";
import TaskReplyStatus from "../../components/task/TaskReplyStatus";
import TaskApprovedDoer from "../../components/task/TaskApprovedDoer";
import TaskVolonteerFeedback from "../../components/task/TaskVolonteerFeedback";
import TaskAdminSupport from "../../components/task/TaskAdminSupport";
import Sidebar from "../../components/layout/partials/Sidebar";
import { ITaskState } from "../../model/model.typing";
import { graphqlQuery as graphqlTaskQuery } from "../../model/task-model/task-model";

const TaskPage: React.FunctionComponent<ITaskState> = (task): ReactElement => {
  const { isLoggedIn, token } = useStoreState((state) => state.session);
  const {...taskState} = useStoreState((state) => state.components.task);
  const setTaskState = useStoreActions((actions) => actions.components.task.setState);
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    setTaskState(task);
  }, [task])

  useEffect(() => {
    // console.log("input:", task.databaseId, slug, isLoggedIn)

    if(task.databaseId || !slug || !isLoggedIn) {
      return
    }

    import("graphql-request").then(async ({ GraphQLClient }) => {
      const graphQLClient = new GraphQLClient(process.env.GraphQLServer);

      try {
        const { task } = await graphQLClient.request(graphqlTaskQuery.getBySlug, {
          taskSlug: String(slug),
        });
        setTaskState(task);
      } catch (error) {
        console.error(error.message);
      }
    });

  }, [slug, task, isLoggedIn])

  return (
    <>
      <DocumentHead />
      <Main>
        {taskState.id && taskState.databaseId &&
        <main id="site-main" className="site-main page-task" role="main">
          <section className="content">
            <h2>Задача</h2>
            <Task />
            <TaskComments />
            <TaskSuggestionsForVolonteers />
          </section>
          <Sidebar>
            <TaskAuthor />
            <TaskBecomeCandidate />
            <TaskReplyStatus />
            <TaskApprovedDoer />
            <TaskVolonteerFeedback />
            <TaskAdminSupport buttonTitle="Что-то не так с задачей? Напишите администратору" />
          </Sidebar>
        </main>
        }
        {!taskState.id &&
        <main id="site-main" className="site-main page-task" role="main">
          <section className="content">
            <h2>Задача не найдена!</h2>
          </section>
        </main>
        }
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { slug },
}) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );

  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { slug },
    entrypointType: "task",
    componentModel: async (request) => {
      const taskModel = await import("../../model/task-model/task-model");
      const taskQuery = taskModel.graphqlQuery.getBySlug;
      const { task: component } = await request(
        process.env.GraphQLServer,
        taskQuery,
        { taskSlug: slug }
      );

      return ["task", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default memo(TaskPage);
