import {
  ReactElement,
  Dispatch,
  ChangeEvent,
  SetStateAction,
  MouseEvent,
  useState,
  useEffect,
} from "react";
import Router, { useRouter } from "next/router";
import { ISnackbarMessage } from "../../../context/global-scripts";

const HeaderSearch: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isCleanOnCrossClick?: boolean;
  submitButton?: any;
}> = ({ addSnackbar, isOpen, setOpen, isCleanOnCrossClick, submitButton }): ReactElement => {
  let timerId: NodeJS.Timeout = null;
  const [isOpenLocally, setOpenLocally] = useState<boolean>(isOpen);
  const doToggle = () => {
    if (isOpen) {
      timerId = setTimeout(() => setOpen(false), 300);
    } else {
      setOpen(true);
    }
    setOpenLocally(!isOpen);
  };
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    doToggle();
  };
  const clean = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSearchPhrase("");
  };
  const {
    query: { s },
  } = useRouter();
  const [searchPhrase, setSearchPhrase] = useState<string>(s as string);
  const typeIn = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.target.value);
  };
  const submit = () => {
    if (!isCleanOnCrossClick) {
      doToggle();
    }
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

  useEffect(() => clearTimeout(timerId), []);

  useEffect(() => setSearchPhrase(s as string), [s]);

  return (
    <div className={`header-search ${isOpenLocally ? "header-search_expanded" : ""}`}>
      <form
        className="header-search-form"
        onSubmit={event => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="header-search-form__group">
          <input
            className={`header-search-form__input ${
              isOpenLocally ? "header-search-form__input_shown" : ""
            } ${isOpen ? "" : "header-search-form__input_hidden"}`}
            type="search"
            value={searchPhrase}
            onChange={typeIn}
            onKeyUp={event => {
              event.preventDefault();
              event.key === "Enter" && submit();
            }}
            placeholder="Введите ключевое слово"
          />
          <button
            className={`header-search-form__toggle ${
              isOpenLocally ? "header-search-form__toggle_close-icon" : ""
            }`}
            type="button"
            onClick={isCleanOnCrossClick ? clean : toggle}
          ></button>
        </div>
        {submitButton}
      </form>
    </div>
  );
};

export default HeaderSearch;
