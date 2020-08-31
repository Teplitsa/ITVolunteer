import { ReactElement } from "react";

const Loader: React.FunctionComponent<{ spinner?: "ring" }> = ({
  spinner = "ring",
}): ReactElement => {
  return (
    <div className={`loader loader_${spinner}`}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Loader;
