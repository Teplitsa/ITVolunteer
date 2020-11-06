import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import TaskSearch from "../../components/task-search/TaskSearch";
import { regEvent } from "../../utilities/ga-events";

const SearchPage: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main page-task-list" role="main">
          <section className="page-header">
            <h1>Результаты поиска</h1>
          </section>
          <div className="page-sections page-sections_search">
            <TaskSearch />
          </div>
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );

  const model = await withAppAndEntrypointModel({
    isArchive: true,
    entrypointType: "task",
    entrypointQueryVars: {
      first: 50,
      after: null,
      searchPhrase: query.s ?? "",
    },
    componentModel: async (request, componentData) => {
      return ["taskList", componentData];
    },
  });

  return {
    props: { ...model },
  };
};

export default SearchPage;
