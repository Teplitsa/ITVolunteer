import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import Link from "next/link";
import NoPreview from "../../assets/img/pic-portfolio-item-no-preview.svg";
// import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberPortfolio: React.FunctionComponent = (): ReactElement => {
  //   const isAccountOwner = useStoreState(state => state.session.isAccountOwner);
  //   const { tasks, memberTaskStats } = useStoreState(state => state.components.memberAccount);

  //   const { setTaskListFilter, getMemberTasksRequest } = useStoreActions(
  //     actions => actions.components.memberAccount
  //   );

  const { username } = useStoreState(store => store.components.memberAccount);

  return (
    <div className="member-portfolio">
      <div className="member-portfolio__header">
        <div className="member-portfolio__title">Портфолио</div>
        <div className="member-portfolio__actions">
          <Link
            href="/members/[username]/add-portfolio-item"
            as={`/members/${username}/add-portfolio-item`}
          >
            <a className="btn btn_hint-alt" target="_blank">
              + Добавить работу
            </a>
          </Link>
        </div>
      </div>
      <div className="member-portfolio__list">
        <div className="member-portfolio__list-item">
          <a href="#">
            <img src={NoPreview} alt="" />
          </a>
          <div className="member-portfolio__list-item-title">
            <a href="#">Настройка G-Suite под ваш домен</a>
          </div>
        </div>
        <div className="member-portfolio__list-item">
          <a href="#">
            <img src={NoPreview} alt="" />
          </a>
          <div className="member-portfolio__list-item-title">
            <a href="#">Сайты на Word Press под ключ</a>
          </div>
        </div>
        <div className="member-portfolio__list-item">
          <a href="#">
            <img src={NoPreview} alt="" />
          </a>
          <div className="member-portfolio__list-item-title">
            <a href="#">Контекстная реклама: Яндекс, Google</a>
          </div>
        </div>
      </div>
      <div className="member-portfolio__footer">
        <a
          href="#"
          className="member-portfolio__more-link"
          onClick={event => {
            event.preventDefault();
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberPortfolio;
