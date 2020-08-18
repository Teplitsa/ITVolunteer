import { ReactElement } from "react";
import UserCardSmall from "./UserCardSmall";
import TaskTags from "../components/task/task-header/TaskTags";

const TaskCard: React.FunctionComponent = (): ReactElement => {
  const userCardSmallProps = {
    id: "",
    fullName: "НКО «Леопарды Дальнего Востока»",
    itvAvatar: null,
    memberRole: "Организация",
  };
  const taskTagsProps = {
    tags: {
      nodes: [
        {
          id: "0",
          name: "WordPress",
          slug: "wordpress",
        },
        {
          id: "1",
          name: "Создание сайта",
          slug: "sozdanie-sajta",
        },
      ],
    },
    rewardTags: {
      nodes: [
        {
          id: "2",
          name: "Устойчивое развитие",
          slug: "ustojchivoe-razvitie",
        },
        {
          id: "3",
          name: "Экоактивизм",
          slug: "jekoaktivizm",
        },
      ],
    },
    ngoTaskTags: {
      nodes: [
        {
          id: "4",
          name: "Есть бюджет",
          slug: "est-bjudzhet",
        },
      ],
    },
  };

  return (
    <div className="task-card">
      <div className="task-card__header">
        <UserCardSmall {...userCardSmallProps} />
        <div className="task-card__date">Открыто 4 дня назад</div>
        <div className="task-card__сandidate-сount">1 отклик</div>
      </div>
      <div className="task-card__title">
        <a href="#">Нужен сайт на Word Press для нашей организации</a>
      </div>
      <div className="task-card__excerpt">
        Делаем сайт для всех кто хочет сохранить популяцию леопародов. Это сайт
        который поможет им расставить приоритеты. Сайт нужен на WordPress. Как
        хочу чтобы работало: 1. Eсть уже на сайте галерея…{" "}
        <a href="#">Подробнее</a>
      </div>
      <div className="task-card__footer">
        <TaskTags {...taskTagsProps} />
      </div>
    </div>
  );
};

export default TaskCard;
