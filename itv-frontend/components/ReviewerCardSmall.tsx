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
          backgroundImage:
            avatar && avatar.search(/temp-avatar\.png/) === -1
              ? `url(${avatar})`
              : "none",
        }}
      />
      <span className="name">
        <span dangerouslySetInnerHTML={{ __html: fullName }} />
        {task && (
          <>
            {" / "}
            <Link href={`${task.slug}`}>
              <a dangerouslySetInnerHTML={{ __html: task.title }} />
            </Link>
          </>
        )}
      </span>
    </div>
  );
};

export default ReviewerCardSmall;
