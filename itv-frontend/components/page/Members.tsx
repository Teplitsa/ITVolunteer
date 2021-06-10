import { ReactElement, useState, useEffect, MouseEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import FormControlSelect from "../ui/form/FormControlSelect";
import MemberList from "../members/MemberList";
import { USER_RATING_START_YEAR } from "../../model/components/members-model";
import { regEvent } from "../../utilities/ga-events";
import { convertObjectToClassName } from "../../utilities/utilities";

const monthSelectOptions = [
  "В январе",
  "В феврале",
  "В марте",
  "В апреле",
  "В мае",
  "В июне",
  "В июле",
  "В августе",
  "В сентябре",
  "В октябре",
  "В ноябре",
  "В декабре",
].map((label, i) => ({
  value: i + 1,
  label,
}));

const getYearSelectOptions = (
  now: number
): Array<{
  value: number;
  label: string;
}> =>
  new Array(new Date(now).getFullYear() - USER_RATING_START_YEAR + 1)
    .fill(new Date(now).getFullYear())
    .map((currentYear, i) => {
      return {
        value: currentYear - i,
        label: `За ${currentYear - i} год`,
      };
    });

const Members: React.FunctionComponent = (): ReactElement => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);
  const now = useStoreState(state => state.app.now);
  const month = useStoreState(state => state.components.members.userFilter.month);
  const year = useStoreState(state => state.components.members.userFilter.year);
  const name = useStoreState(state => state.components.members.userFilter.name);
  const setCrumbs = useStoreActions(actions => actions.components.breadCrumbs.setCrumbs);
  const setFilter = useStoreActions(actions => actions.components.members.setFilter);
  const userListRequest = useStoreActions(actions => actions.components.members.userListRequest);

  const router = useRouter();

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setFilter({ month: Number(event.currentTarget.selectedOptions[0].value), page: 1 });
    isReset && setIsReset(false);
    setLoading(true);
    userListRequest({ replaceUserList: true, setLoading });
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const year = Number(event.currentTarget.selectedOptions[0].value);

    if (year == 0) {
      setFilter({ year, month: 0, page: 1 });
      !isReset && setIsReset(true);
    } else {
      setFilter({ year, page: 1 });
      isReset && setIsReset(false);
    }

    setLoading(true);
    userListRequest({ replaceUserList: true, setLoading });
  };

  const handleFilterReset = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    if (isReset) {
      setFilter({
        month: new Date(now).getMonth() + 1,
        year: new Date(now).getFullYear(),
        page: 1,
      });
    } else {
      setFilter({ month: 0, year: 0, page: 1 });
    }

    setIsReset(!isReset);
    setLoading(true);
    userListRequest({ replaceUserList: true, setLoading });
  };

  const handleNameInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setFilter({ name: event.currentTarget.value });
    setLoading(true);
    userListRequest({ replaceUserList: true, setLoading });
  };

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  useEffect(() => {
    setCrumbs([{ title: "Рейтинг" }]);
  }, []);

  useEffect(() => {
    if (month === 0 && year === 0 && isReset !== true) setIsReset(true);
  }, []);

  return (
    <div className="members">
      <div className="members__content">
        <div className="members__top">
          <h1 className="members__title">Рейтинг</h1>
          <div className="members__date-filter">
            <div className="date-filter">
              <div className="date-filter__item">
                <FormControlSelect
                  selectExtraClassName="form__select-control_filter"
                  useTags={false}
                  name="month"
                  defaultValue={month}
                  onChange={handleMonthChange}
                >
                  {[
                    {
                      value: 0,
                      label: "Месяц не выбран",
                    },
                  ].concat(monthSelectOptions)}
                </FormControlSelect>
              </div>
              <div className="date-filter__item">
                <FormControlSelect
                  selectExtraClassName="form__select-control_filter"
                  useTags={false}
                  name="year"
                  defaultValue={year}
                  onChange={handleYearChange}
                >
                  {[
                    {
                      value: 0,
                      label: "Год не выбран",
                    },
                  ].concat(getYearSelectOptions(now))}
                </FormControlSelect>
              </div>
              <div className="date-filter__item">
                <button
                  className={convertObjectToClassName({
                    btn: true,
                    btn_filter: true,
                    "date-filter__reset": true,
                    "date-filter__reset_active": isReset,
                  })}
                  type="reset"
                  onClick={handleFilterReset}
                >
                  {isReset
                    ? "За всё время"
                    : `Дефолтный: за ${new Intl.DateTimeFormat("ru-RU", {
                        month: "long",
                        year: "numeric",
                      }).format(now)}`}
                </button>
              </div>
            </div>
          </div>
          <div className="members__live-search">
            <div className="form__group">
              <input
                className="form__control form__control_input form__control_input-small form__control_input-search form__control_full-width"
                type="search"
                name="name"
                defaultValue={name}
                placeholder="Поиск по имени"
                autoComplete="off"
                onInput={handleNameInput}
              />
            </div>
          </div>
        </div>
        <div className="members__list">
          <MemberList {...{ isLoading, setLoading }} />
        </div>
      </div>
    </div>
  );
};

export default Members;
