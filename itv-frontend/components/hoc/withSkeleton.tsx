import DocumentHead from "../DocumentHead";
import MainSkeleton from "../skeletons/MainSkeleton";
import HomeSkeleton from "../skeletons/HomeSkeleton";
import MemberListSkeleton from "../skeletons/MemberListSkeleton";
import MemberAccountSkeleton from "../skeletons/MemberAccountSkeleton";
import TaskListSkeleton from "../skeletons/TaskListSkeleton";
import TaskSkeleton from "../skeletons/TaskSkeleton";

const withSkeleton = ({
  pathname,
}: {
  pathname: string;
}): React.FunctionComponent => {
  let MainSkeletonContent: React.FunctionComponent | null = null;

  if (pathname.search(/^\/$/i) !== -1) {
    MainSkeletonContent = () => <HomeSkeleton />;
  } else if (pathname.search(/^\/members$/i) !== -1) {
    MainSkeletonContent = () => <MemberListSkeleton />;
  } else if (pathname.search(/^\/members\/\S+$/i) !== -1) {
    MainSkeletonContent = () => <MemberAccountSkeleton />;
  } else if (pathname.search(/^\/tasks$/i) !== -1) {
    MainSkeletonContent = () => <TaskListSkeleton />;
  } else if (pathname.search(/^\/tasks\/\S+$/i) !== -1) {
    MainSkeletonContent = () => <TaskSkeleton />;
  }

  return (
    (!Object.is(MainSkeletonContent, null) &&
      (() => (
        <>
          <DocumentHead />
          <MainSkeleton>
            <MainSkeletonContent />
          </MainSkeleton>
        </>
      ))) ||
    null
  );
};

export default withSkeleton;
