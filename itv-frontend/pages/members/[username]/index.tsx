import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import MemberAccount from "../../../components/page/MemberAccount";
import { getRestApiUrl, stripTags } from "../../../utilities/utilities";

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

      const memberItvRoleResponse = await fetch(
        getRestApiUrl(`/itv/v1/member/${query.username}/itv_role`)
      );

      member = Object.assign(member ?? {}, {
        template: (await memberItvRoleResponse.json()).itvRole === "doer" ? "volunteer" : "author",
      });

      const { user } = await request(process.env.GraphQLServer, graphqlQuery.member, {
        slug: query.username,
      });

      member = Object.assign(member ?? {}, user);

      const { memberTasks: taskList } = await request(
        process.env.GraphQLServer,
        graphqlQuery.memberTasks,
        {
          username: query.username,
          page: memberAccountPageState.tasks.page,
          role: member.itvRole,
        }
      );

      member = Object.assign(member ?? {}, {
        tasks: {
          filter: memberAccountPageState.tasks.filter,
          page: memberAccountPageState.tasks.page,
          list: taskList ?? [],
        },
      });

      const memberReviewsRequestUrl = new URL(
        getRestApiUrl(
          `/itv/v1/reviews/${member.itvRole === "doer" ? "for-doer" : "for-author"}/${
            query.username
          }`
        )
      );

      memberReviewsRequestUrl.search = new URLSearchParams({
        page: `${memberAccountPageState.reviews.page}`,
        per_page: "3",
      }).toString();

      const memberReviewsResponse = await fetch(memberReviewsRequestUrl.toString());

      const memberReviewList = await memberReviewsResponse.json();

      memberReviewList instanceof Array &&
        (member = Object.assign(member ?? {}, {
          reviews: {
            page: memberAccountPageState.reviews.page,
            list: memberReviewList,
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

      return ["memberAccount", { ...memberAccountPageState, ...member }];
    },
  });
  
  return {
    props: { ...model },
  };
};

export default AccountPage;
