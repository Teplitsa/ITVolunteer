import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";

const TaskList: React.FunctionComponent = (): ReactElement => {
  const { items } = useStoreState((state) => state.components.taskList);

  return (
    <section className="task-list">
      {items.map(({ id, title, slug, content }) => {
        return (
          <div key={id} className="task-body">
            <h1>
              <Link href="/tasks/[slug]" as={`/tasks/${slug}`}>
                <a dangerouslySetInnerHTML={{ __html: title }} />
              </Link>
            </h1>
            <div
              className="task-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        );
      })}
    </section>
  );
};

export default TaskList;
