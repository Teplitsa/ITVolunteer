import { ReactElement, SyntheticEvent } from "react";
import Link from "next/link";
import { ISnackbarMessage } from "../../context/global-scripts";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberSecurity: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
}> = ({ addSnackbar }): ReactElement => {
  const username = useStoreState((state) => state.session.user.username);
  const memberSecurity = useStoreState(
    (state) => state.components.memberSecurity
  );
  const {
    initializeState: clearForm,
    setState: setMemberSecurityFormState,
  } = useStoreActions((state) => state.components.memberSecurity);

  const submitMemberSecurityForm = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      memberSecurity.newPassword &&
      memberSecurity.newPassword !== memberSecurity.newPasswordRepeat
    ) {
      addSnackbar({ context: "error", text: "Введенные пароли не сопадают." });
      return;
    }

    addSnackbar({ context: "success", text: "Данные успешно сохранены." });
    clearForm();
  };

  return (
    <div className="member-security">
      <div className="member-security__content">
        <h1 className="member-security__title">Управление аккаунтом</h1>
        <form className="member-form" onSubmit={submitMemberSecurityForm}>
          <div className="member-form__item">
            <label htmlFor="login" className="member-form__label">
              Логин
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="login"
              value={memberSecurity.login}
              onChange={(event) =>
                setMemberSecurityFormState({
                  ...memberSecurity,
                  login: event.target.value,
                })
              }
            />
          </div>
          <div className="member-form__item">
            <label htmlFor="email" className="member-form__label">
              Email
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="email"
              name="email"
              value={memberSecurity.email}
              onChange={(event) =>
                setMemberSecurityFormState({
                  ...memberSecurity,
                  email: event.target.value,
                })
              }
            />
          </div>
          <hr className="member-form__item-divider" />
          <div className="member-form__item">
            <label htmlFor="new-passward" className="member-form__label">
              Новый пароль
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="passward"
              name="new-passward"
              value={memberSecurity.newPassword}
              onChange={(event) =>
                setMemberSecurityFormState({
                  ...memberSecurity,
                  newPassword: event.target.value,
                })
              }
            />
          </div>
          <div className="member-form__item">
            <label htmlFor="new-passward-repeat" className="member-form__label">
              Повторить пароль
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="passward"
              name="new-passward-repeat"
              value={memberSecurity.newPasswordRepeat}
              onChange={(event) =>
                setMemberSecurityFormState({
                  ...memberSecurity,
                  newPasswordRepeat: event.target.value,
                })
              }
            />
            <div className="member-form__item-hint">
              Если вы хотите изменить пароль, укажите здесь новое значение. В
              противном случае оставьте пустым.
            </div>
          </div>
          <div className="member-form__item">
            <button className="member-form__submit" type="submit">
              Сохранить
            </button>
          </div>
        </form>
        <div className="member-backwards">
          <Link href={`/members/${username}`}>
            <a className="member-backwards__link">
              Вернуться в режим просмотра
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberSecurity;
