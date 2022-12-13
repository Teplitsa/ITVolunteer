import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import MemberAccount from "../../../components/page/MemberAccount";
import with404 from "../../../components/hoc/with404";
import { getRestApiUrl, stripTags } from "../../../utilities/utilities";
import * as utils from "../../../utilities/utilities";

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

const AccountPageWith404 = with404(AccountPage);

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  const { fullName } = await (
    await utils.tokenFetch(getRestApiUrl(`/itv/v1/member/${query.username}?_fields[]=fullName`))
  ).json();
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
          canonical: `https://itivist.org/members/${query.username}`,
          title: `${fullName} — IT-волонтер`,
          metaRobotsNoindex: "index",
          metaRobotsNofollow: "follow",
          opengraphTitle: `${fullName} — IT-волонтер`,
          opengraphUrl: `https://itivist.org/members/${query.username}`,
          opengraphSiteName: "IT-волонтер",
        },
      },
    ],
    componentModel: async request => {
      const { memberAccountPageState, graphqlQuery } = await import(
        "../../../model/components/member-account-model"
      );
      let member = null;

      const memberItvRoleResponse = await utils.tokenFetch(
        getRestApiUrl(`/itv/v1/member/${query.username}/itv_role`)
      );

      member = Object.assign(member ?? {}, {
        template:
          (await memberItvRoleResponse.json()).itvRole === "doer" ? "volunteer" : "customer",
      });

      const { user } = await request(process.env.GraphQLServer, graphqlQuery.member, {
        slug: query.username,
      });

      if (Object.is(user, null)) {
        res.statusCode = 404;

        return ["memberAccount", { ...memberAccountPageState }];
      }

      member = Object.assign(member, user);

      const { memberTasks: taskList } = await request(
        process.env.GraphQLServer,
        graphqlQuery.memberTasks,
        {
          slug: query.username,
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

      const memberReviewsResponse = await utils.tokenFetch(memberReviewsRequestUrl.toString());

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

      const memberPortfolioResponse = await utils.tokenFetch(memberPortfolioRequestUrl.toString());

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

  if (res.statusCode === 404) {
    Object.assign(model, { statusCode: 404 });
  }

  return {
    props: { ...model },
  };
};

export default AccountPageWith404;
