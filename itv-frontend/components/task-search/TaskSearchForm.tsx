import { ReactElement, ChangeEvent, useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { ISnackbarMessage } from "../../context/global-scripts";

const TaskSearchForm: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
}> = ({ addSnackbar }): ReactElement => {
  const {
    query: { s },
  } = useRouter();
  const [searchPhrase, setSearchPhrase] = useState<string>(s as string);
  const typeIn = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.target.value);
  };
  const submit = () => {
    if (searchPhrase) {
      Router.push({
        pathname: "/search",
        query: { s: searchPhrase },
      });
    } else {
      addSnackbar({
        context: "error",
        text: "Пожалуйста, введите ключевое слово.",
      });
    }
  };

  useEffect(() => setSearchPhrase(s as string), [s]);

  return (
    <div className="search-from">
      <div className="search-from__group">
        <input
          className="search-from__control search-from__control_input"
          type="search"
          value={searchPhrase}
          onChange={typeIn}
          onKeyUp={(event) => {
            event.preventDefault();
            event.key === "Enter" && submit();
          }}
        />
        <button
          className="search-from__control search-from__control_submit"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          Поиск
        </button>
      </div>
    </div>
  );
};

export default TaskSearchForm;
