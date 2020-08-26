import { ReactElement } from "react";
import Link from "next/link";

const ReviewerCardSmall: React.FunctionComponent<{
  fullName: string;
  avatar?: string;
  task: {
    slug: string;
    title: string;
  };
}> = ({ fullName, avatar, task }): ReactElement => {
  return (
    <div className="itv-user-small-view">
      <span
        className="avatar-wrapper"
        style={{
          backgroundImage: avatar ? `url(${avatar})` : "none",
        }}
      />
      <span className="name">
        <span>{fullName}</span>
        {task && (
          <>
            {" / "}
            <Link href={`${task.slug}`}>
              <a>{task.title}</a>
            </Link>
          </>
        )}
      </span>
    </div>
  );
};

export default ReviewerCardSmall;
