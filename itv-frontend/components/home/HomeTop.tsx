import { ReactElement, MouseEvent, useEffect } from "react";
import { useStoreActions, useStoreState } from "../../model/helpers/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";
import { TaskListItemHome } from "../task-list/TaskListItem";
import MemberListItemTop from "../members/MemberListItemTop";
import withSlideIn from "../hoc/withSlideIn";
import { regEvent } from "../../utilities/ga-events";

const users: any = [
  {
    id: "dXNlcjoxODQw",
    slug: "gusev",
    itvAvatar: "http://localhost:9000/wp-content/uploads/2019/12/itv-180x180.jpeg",
    fullName: "Александр Гусев",
    username: "gusev",
    memberRole: "Супергерой",
    organizationName: "&#34;Бизнес-Ателье&#34;",
    organizationDescription: "- Разработка сайтов",
    rating: 4.9921259842519685,
    reviewsCount: 124,
    xp: 16021,
    solvedProblems: 128,
    facebook: "facebook.com/AlexanGusev",
    instagram: "",
    vk: "https://vk.com/AlexanGusev",
    organizationSite: "https://business-atelier.ru",
    registrationDate: 1441670400,
  },
  {
    id: "dXNlcjoyNjc=",
    slug: "liam",
    itvAvatar: "http://localhost:9000/wp-content/themes/tstsite/assets/img/temp-avatar.png",
    fullName: "Алексей Клёсов",
    username: "liam",
    memberRole: "Супергерой",
    organizationName: "",
    organizationDescription: "",
    rating: 4.967213114754099,
    reviewsCount: 63,
    xp: 12025,
    solvedProblems: 84,
    facebook: "https://www.facebook.com/klylex",
    instagram: "",
    vk: "https://vk.com/klylex",
    organizationSite: "",
    registrationDate: 1413590400,
  },
  {
    id: "dXNlcjoyMjg0",
    slug: "titov",
    itvAvatar: "http://localhost:9000/wp-content/themes/tstsite/assets/img/temp-avatar.png",
    fullName: "Андрей Титов",
    username: "titov",
    memberRole: "Супергерой",
    organizationName: "Андрей Титов",
    organizationDescription: "",
    rating: 4.7407407407407405,
    reviewsCount: 27,
    xp: 9299,
    solvedProblems: 43,
    facebook: "https://www.facebook.com/titov.andrei",
    instagram: "",
    vk: "https://vk.com/titov_andrei",
    organizationSite: "http://localhost:9000/members/titov",
    registrationDate: 1453161600,
  },
  {
    id: "dXNlcjo5MDI=",
    slug: "citycelebrity",
    itvAvatar: "http://localhost:9000/wp-content/themes/tstsite/assets/img/temp-avatar.png",
    fullName: "Сайт Ситиселебрити",
    username: "citycelebrity",
    memberRole: "Супергерой",
    organizationName: "",
    organizationDescription: "",
    rating: 5,
    reviewsCount: 15,
    xp: 5422,
    solvedProblems: 31,
    facebook: "http://www.facebook.com/Citycelebrity.ru",
    instagram: "",
    vk: "http://vk.com/club15502069",
    organizationSite: "http://citycelebrity.ru",
    registrationDate: 1426723200,
  },
  {
    id: "dXNlcjoyMzcw",
    slug: "diana_sar",
    itvAvatar: "http://localhost:9000/wp-content/themes/tstsite/assets/img/temp-avatar.png",
    fullName: "Diana Sar",
    username: "diana_sar",
    memberRole: "Супергерой",
    organizationName: "Freelance",
    organizationDescription: "",
    rating: 5,
    reviewsCount: 34,
    xp: 5053,
    solvedProblems: 38,
    facebook: "https://www.facebook.com/profile.php?id=100006747755695",
    instagram: "",
    vk: "https://vk.com/feed",
    organizationSite: "http://localhost:9000/members/diana_sar",
    registrationDate: 1455321600,
  },
  {
    id: "dXNlcjoxNjkz",
    slug: "elizaveta",
    itvAvatar: "http://localhost:9000/wp-content/themes/tstsite/assets/img/temp-avatar.png",
    fullName: "Елизавета Побережная",
    username: "elizaveta",
    memberRole: "Супергерой",
    organizationName: "Елизавета",
    organizationDescription: "",
    rating: 4.6875,
    reviewsCount: 16,
    xp: 3903,
    solvedProblems: 25,
    facebook: "",
    instagram: "",
    vk: "",
    organizationSite: "",
    registrationDate: 1438128000,
  },
];

const HomeTaskTop: React.FunctionComponent = (): ReactElement => {
  const taskList = useStoreState(state => state.components.homePage.taskList);
  const router = useRouter();

  const handleMoreBtnClick = () => regEvent("hp_more_nav", router);

  return (
    <section className="home-top">
      <h3 className="home-top__title home-title">Открытые задачи</h3>
      <HomeInterfaceSwitch />
      <div className="home-top__list">
        <div className="task-list">
          {taskList.map((task, i) =>
            withSlideIn({
              component: TaskListItemHome,
              from: i % 2 ? "right" : "left",
              fullWidth: false,
              key: task.id,
              ...task,
            })
          )}
        </div>
      </div>
      <div className="home-top__more">
        <Link href="/tasks">
          <a className="btn btn_link" onClick={handleMoreBtnClick}>
            Все задачи
          </a>
        </Link>
      </div>
    </section>
  );
};

const HomeUserTop: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const memberList = useStoreState(state => state.components.homePage.memberList);
  const router = useRouter();

  const handleMoreBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isLoggedIn) {
      router.push("/task-create");
    } else {
      router.push("/registration");
    }
  };

  return (
    <section className="home-top">
      <h3 className="home-top__title home-title">Десятки волонтёров готовы вам помочь</h3>
      <HomeInterfaceSwitch />
      <div className="home-top__list">
        <div className="volunteer-list">
          {memberList?.map((user, i) =>
            withSlideIn({
              component: MemberListItemTop,
              from: i % 2 ? "right" : "left",
              fullWidth: false,
              key: user.id,
              index: i + 1,
              member: user,
            })
          )}
        </div>
      </div>
      <div className="home-top__more">
        <a href="#" className="btn btn_link" onClick={handleMoreBtnClick}>
          Создай задачу
        </a>
      </div>
    </section>
  );
};

const HomeTop: React.FunctionComponent = (): ReactElement => {
  const template = useStoreState(state => state.components.homePage.template);
  const loadMembersRequest = useStoreActions(state => state.components.homePage.loadMembersRequest);

  useEffect(() => loadMembersRequest(), []);

  return template === "author" ? <HomeUserTop /> : <HomeTaskTop />;
};

export default HomeTop;
