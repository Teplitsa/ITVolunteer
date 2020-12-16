import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import MemberAccount from "../../../components/page/MemberAccount";
import { getAjaxUrl, getRestApiUrl, stripTags } from "../../../utilities/utilities";

const AccountPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <MemberAccount />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `members/${query.username}`,
        seo: {
          canonical: `https://itv.te-st.ru/members/${query.username}`,
          title: `${query.username} - аккаунт на сайте it-волонтер`,
          metaRobotsNoindex: "index",
          metaRobotsNofollow: "follow",
          opengraphTitle: `${query.username} - аккаунт на сайте it-волонтер`,
          opengraphUrl: `https://itv.te-st.ru/members/${query.username}`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async request => {
      const { memberAccountPageState, graphqlQuery } = await import(
        "../../../model/components/member-account-model"
      );
      let member = null;

      const { user } = await request(process.env.GraphQLServer, graphqlQuery.member, {
        username: query.username,
      });

      member = user;

      const { memberTasks: taskList } = await request(
        process.env.GraphQLServer,
        graphqlQuery.memberTasks,
        {
          username: query.username,
          page: memberAccountPageState.tasks.page,
        }
      );

      member = Object.assign(member ?? {}, {
        tasks: {
          filter: memberAccountPageState.tasks.filter,
          page: memberAccountPageState.tasks.page,
          list: taskList ?? [],
        },
      });

      const memberReviewsResponse = await fetch(
        `${getAjaxUrl("get-member-reviews")}${`&username=${query.username}&page=${0}`}`
      );
      const {
        status: memberReviewsStatus = "error",
        data: memberReviews = null,
      } = await memberReviewsResponse.json();

      memberReviewsStatus === "ok" &&
        (member = Object.assign(member ?? {}, {
          reviews: {
            page: memberAccountPageState.reviews.page,
            list: memberReviews,
          },
        }));

      const memberPortfolioRequestUrl = new URL(getRestApiUrl(`/wp/v2/portfolio_work`));

      memberPortfolioRequestUrl.search = new URLSearchParams({
        page: "1",
        per_page: "3",
        author: `${user.databaseId}`,
      }).toString();

      const memberPortfolioResponse = await fetch(memberPortfolioRequestUrl.toString());

      member = Object.assign(member ?? {}, {
        portfolio: {
          page: 1,
          list: (await memberPortfolioResponse.json()).map(
            ({
              id,
              slug,
              title: { rendered: renderedTitle },
              content: { rendered: renderedContent },
              featured_media: preview,
              meta: { portfolio_image_id: fullImage },
            }) => ({
              id,
              slug,
              title: stripTags(renderedTitle).trim(),
              description: stripTags(renderedContent).trim(),
              preview,
              fullImage,
            })
          ),
        },
      });

      member = Object.assign(member ?? {}, {
        notifications: {
          filter: "all",
          page: 1,
          list: [
            {
              type: "warning-message",
              icon: "notification",
              title: [
                { text: "У вас осталось 2 дня чтобы закрыть задачу" },
                { keyword: "Нужен сайт на Word Press" },
              ],
              time: "2 ч. назад",
            },
            {
              avatar: "/wp-content/uploads/2019/12/itv-180x180.jpeg",
              icon: "hard-rock",
              title: [
                { keyword: "Александр Гусев" },
                { text: "прокомментировал задачу" },
                { keyword: "Нужен сайт на Word Press" },
              ],
              time: "3 ч. назад",
            },
            {
              icon: "notification",
              title: [{ text: "Приходите на конференцию 11 апреля, будет круто" }],
              time: "3 ч. назад",
            },
            {
              icon: "list",
              type: "new-message",
              title: [
                { keyword: "Новая задача" },
                { text: "по тегу" },
                { keyword: "WordPress" },
                { text: "посмотрим?" },
                {
                  link: {
                    url: "/",
                    text: "Перейти к задаче",
                  },
                },
              ],
              time: "3 ч. назад",
            },
            {
              icon: "reward",
              title: [{ text: "Вы получили награду за" }, { keyword: "10 закрытых задач" }],
              time: "3 ч. назад",
            },
          ],
        },
      });

      // TODO: REST API for notification stats request

      member = Object.assign(member ?? {}, {
        notificationStats: {
          project: 3,
          info: 123,
        },
      });

      return ["memberAccount", { ...memberAccountPageState, ...member }];
    },
  });

  return {
    props: { ...model },
  };
};

export default AccountPage;
