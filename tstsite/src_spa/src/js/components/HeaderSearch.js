import React, {Component, useState, useEffect} from 'react'

function HeaderSearch({isOpen, setOpen}) {
  let timerId = null;
  const [isOpenLocally, setOpenLocally] = useState(isOpen);
  const toggle = (event) => {
    event.preventDefault();
    if (isOpen) {
      timerId = setTimeout(() => setOpen(false), 300);
    } else {
      setOpen(true);
    }
    setOpenLocally(!isOpen);
  };
  const [searchPhrase, setSearchPhrase] = useState("");
  const typeIn = (event) => {
    setSearchPhrase(event.target.value);
  };
  const submit = () => {
    if (searchPhrase) {
      document.location.href = "/search?s=" + searchPhrase
    }
  };

  useEffect(() => clearTimeout(timerId), []);

  return (
    <div
      className={`header-search ${
        isOpenLocally ? "header-search_expanded" : ""
      }`}
    >
      <form
        className="header-search-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="header-search-form__group">
          <input
            className={`header-search-form__input ${
              isOpenLocally ? "header-search-form__input_shown" : ""
            } ${isOpen ? "" : "header-search-form__input_hidden"}`}
            type="search"
            value={searchPhrase}
            onChange={typeIn}
            onKeyUp={(event) => {
              event.preventDefault();
              event.key === "Enter" && submit();
            }}
            placeholder="Введите ключевое слово"
          />
          <button
            className={`header-search-form__toggle ${
              isOpenLocally ? "header-search-form__toggle_close-icon" : ""
            }`}
            type="submit"
            onClick={toggle}
          ></button>
        </div>
      </form>
    </div>
  );
};

export default HeaderSearch;
