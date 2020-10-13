import { ReactElement, useState, useEffect } from "react";
import Link from "next/link";
import MemberAvatarDefault from "../assets/img/member-default.svg";

const ReviewerCardSmall: React.FunctionComponent<{
  fullName: string;
  avatar?: string;
  task: {
    slug: string;
    title: string;
  };
}> = ({ fullName, avatar, task }): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    try {
      avatar &&
        avatar.search(/temp-avatar\.png/) === -1 &&
        fetch(avatar, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then((response) => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

  return (
    <div className="itv-user-small-view">
      <span
        className={`avatar-wrapper ${
          isAvatarImageValid ? "" : "avatar-wrapper_default-image"
        }`}
        style={{
          backgroundImage: isAvatarImageValid
            ? `url(${avatar})`
            : `url(${MemberAvatarDefault})`,
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
