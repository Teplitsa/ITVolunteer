import { ReactElement, MouseEvent } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { useRouter } from "next/router";
import withFadeIn from "../hoc/withFadeIn";
import { Image } from "../gutenberg/CoreMediaTextBlock";
import NoItemsForVolunteerImage from "../../assets/img/members-no-items_volunteer.svg";
import NoItemsForAuthorImage from "../../assets/img/members-no-items_author.svg";

const MemberListNoItems: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const itvRole = useStoreState(state => state.session.user.itvRole);
  const router = useRouter();

  const handleCtaBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isLoggedIn && itvRole === "customer") {
      router.push("/task-create");
    } else {
      router.push("/tasks");
    }
  };

  return (
    <div className="members-list-no-items">
      <div className="members-list-no-items__message">
        В рейтинге пока никого нет.
        <br />У тебя есть шанс стать первым!
      </div>
      <div className="members-list-no-items__cta">
        <a href="#" className="btn btn_primary-lg" onClick={handleCtaBtnClick}>
          {isLoggedIn && itvRole === "customer" ? "Создать задачу" : "Найти задачу"}
        </a>
      </div>
      {withFadeIn({
        component: Image,
        mediaUrl:
          isLoggedIn && itvRole === "customer" ? NoItemsForAuthorImage : NoItemsForVolunteerImage,
        mediaAlt: "",
        mediaHeight: 350,
        className: "members-list-no-items__image",
      })}
    </div>
  );
};

export default MemberListNoItems;
