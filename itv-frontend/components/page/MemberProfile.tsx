import { ReactElement, SyntheticEvent } from "react";
import Link from "next/link";
import { ISnackbarMessage } from "../../context/global-scripts";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberProfile: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
}> = ({ addSnackbar }): ReactElement => {
  const username = useStoreState((state) => state.session.user.username);
  const memberProfile = useStoreState(
    (state) => state.components.memberProfile
  );
  const {
    initializeState: clearForm,
    setState: setMemberProfileFormState,
  } = useStoreActions((state) => state.components.memberProfile);

  const submitMemberProfileForm = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    addSnackbar({ context: "success", text: "Данные успешно сохранены." });
    clearForm();
  };

  return (
    <div className="member-profile">
      <div className="member-profile__content">
        <h1 className="member-profile__title">Данные профиля</h1>
        <form className="member-form" onSubmit={submitMemberProfileForm}>
          <div className="member-form__item">
            <label htmlFor="name" className="member-form__label">
              Ваше имя
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="name"
              value={memberProfile.user?.name ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  user: { ...memberProfile.user, name: event.target.value },
                })
              }
            />
          </div>
          <div className="member-form__item">
            <label htmlFor="surname" className="member-form__label">
              Фамилия
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="surname"
              value={memberProfile.user?.surname ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  user: { ...memberProfile.user, surname: event.target.value },
                })
              }
            />
          </div>
          <hr className="member-form__item-divider" />
          <div className="member-form__item">
            <label htmlFor="organization-name" className="member-form__label">
              Название организации
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="organization-name"
              value={memberProfile.organization?.name ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  organization: {
                    ...memberProfile.organization,
                    name: event.target.value,
                  },
                })
              }
            />
          </div>
          <div className="member-form__item">
            <label
              htmlFor="organization-description"
              className="member-form__label"
            >
              Описание организации
            </label>
            <textarea
              className="member-form__control member-form__control_textarea"
              name="organization-description"
              value={memberProfile.organization?.description ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  organization: {
                    ...memberProfile.organization,
                    description: event.target.value,
                  },
                })
              }
            ></textarea>
          </div>
          <div className="member-form__item">
            <label htmlFor="organization-site" className="member-form__label">
              Веб-сайт
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="organization-site"
              value={memberProfile.organization?.site ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  organization: {
                    ...memberProfile.organization,
                    site: event.target.value,
                  },
                })
              }
            />
          </div>
          <hr className="member-form__item-divider" />
          <div className="member-form__item">
            <label htmlFor="skype" className="member-form__label">
              Skype
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="skype"
              value={memberProfile.user?.contacts?.skype ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  user: {
                    ...memberProfile.user,
                    ...{
                      contacts: {
                        ...memberProfile.user?.contacts,
                        skype: event.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div className="member-form__item">
            <label htmlFor="twitter" className="member-form__label">
              Twitter (имя пользователя без @)
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="twitter"
              value={memberProfile.user?.contacts?.twitter ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  user: {
                    ...memberProfile.user,
                    ...{
                      contacts: {
                        ...memberProfile.user?.contacts,
                        twitter: event.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div className="member-form__item">
            <label htmlFor="facebook" className="member-form__label">
              Профиль Facebook (ссылка)
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="facebook"
              value={memberProfile.user?.contacts?.facebook ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  user: {
                    ...memberProfile.user,
                    ...{
                      contacts: {
                        ...memberProfile.user?.contacts,
                        facebook: event.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div className="member-form__item">
            <label htmlFor="vk" className="member-form__label">
              Профиль ВКонтакте (ссылка)
            </label>
            <input
              className="member-form__control member-form__control_input"
              type="text"
              name="vk"
              value={memberProfile.user?.contacts?.vk ?? ""}
              onChange={(event) =>
                setMemberProfileFormState({
                  ...memberProfile,
                  user: {
                    ...memberProfile.user,
                    ...{
                      contacts: {
                        ...memberProfile.user?.contacts,
                        vk: event.target.value,
                      },
                    },
                  },
                })
              }
            />
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

export default MemberProfile;
