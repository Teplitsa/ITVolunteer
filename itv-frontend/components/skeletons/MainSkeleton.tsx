import { ReactElement } from "react";
import SkeletonHeader from "../skeletons/partials/SkeletonHeader";
import SkeletonFooter from "../skeletons/partials/SkeletonFooter";

const MainSkeleton: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <main className="main-skeleton">
      <SkeletonHeader />
      {children}
      <SkeletonFooter />
    </main>
  );
};

export default MainSkeleton;
