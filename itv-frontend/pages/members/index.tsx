import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Members from "../../components/page/Members";
import { getRestApiUrl } from "../../utilities/utilities";
import { IRestApiResponse, IMemberListItem } from "../../model/model.typing";
import { authorizeSessionSSRFromRequest } from "../../model/session-model";

const MembersPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <Members />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );

  const session = await authorizeSessionSSRFromRequest(req, res);

  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `members`,
        seo: {
          canonical: `https://itvist.org/members`,
          title: `Волонтёры - it-волонтер`,
          metaRobotsNoindex: "index",
          metaRobotsNofollow: "follow",
          opengraphTitle: `Волонтёры - it-волонтер`,
          opengraphUrl: `https://itvist.org/members`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {

      const { membersPageState, memberListItemQueriedFields } = await import(
        "../../model/components/members-model"
      );

      const memberListState = Object.assign({}, membersPageState);
      Object.assign(memberListState.userFilter, {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });

      try {
        const requestURL = new URL(getRestApiUrl(`/itv/v1/member/ratingList/doer`));

        requestURL.search = (() => {
          return memberListItemQueriedFields.map(paramValue => `_fields[]=${paramValue}`).join("&");
        })();

        requestURL.searchParams.set("month", String(memberListState.userFilter.month));
        requestURL.searchParams.set("year", String(memberListState.userFilter.year));
        requestURL.searchParams.set("name", memberListState.userFilter.name);
        requestURL.searchParams.set("page", String(memberListState.userFilter.page));

        const memberListResponse = await fetch(requestURL.toString());
        const response: IRestApiResponse & Array<IMemberListItem> = await memberListResponse.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error(response.message);
        } else if (Array.isArray(response)) {
          Object.assign(memberListState, {
            userListStats: {
              total:
                memberListResponse.headers.get("x-wp-total") ?? memberListState.userListStats.total,
            },
            userList: response.length === 0 ? memberListState.userList : response,
          });
        }
      } catch (error) {
        console.error(error);
      }

      return ["members", { ...memberListState }];
    },
  });

  return {
    props: { ...model, session },
  };
};

export default MembersPage;
