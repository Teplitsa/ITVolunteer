import { ReactElement } from "react";

const TaskList: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="task-list-skeleton__task-list">
      {Array(4)
        .fill(null)
        .map((_, taskListItemIndex) => (
          <div
            key={`TaskListItem-${taskListItemIndex}`}
            className="task-list-skeleton__task-list-item"
          >
            <div className="task-list-skeleton__item-user-card" />
            <div className="task-list-skeleton__item-title" />
            <div className="task-list-skeleton__item-content" />
            <div className="task-list-skeleton__item-meta">
              {Array(2)
                .fill(null)
                .map((_, itemMetaGroupIndex) => (
                  <div
                    key={`ItemMetaGroup-${itemMetaGroupIndex}`}
                    className="task-list-skeleton__item-meta-group"
                  >
                    {Array(4)
                      .fill(null)
                      .map((_, itemMetaTermIndex) => (
                        <div
                          key={`ItemMetaTerm-${itemMetaTermIndex}`}
                          className="task-list-skeleton__item-meta-term"
                        />
                      ))}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TaskList;
