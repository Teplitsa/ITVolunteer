import { ReactElement, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { ISnackbarMessage } from "../../context/global-scripts";
import * as _ from "lodash";

const EditMemberProfile: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
  clearSnackbar: () => void;
  deleteSnackbar: (message: ISnackbarMessage) => void;
}> = ({ addSnackbar, clearSnackbar, deleteSnackbar }): ReactElement => {
  const formRef = useRef(null);
  const user = useStoreState((state) => state.session.user);
  const updateProfileRequest = useStoreActions(
    (actions) => actions.components.memberProfile.updateProfileRequest
  );
  const [registrationSuccessText, setRegistrationSuccessText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stateFormData, setStateFormData] = useState(null);

  useEffect(() => {
    const profile = new FormData();

    profile.append("first_name", user.firstName);
    profile.append("last_name", user.lastName);
    profile.append("user_workplace", user.organizationName);
    profile.append("user_workplace_desc", user.organizationDescription);
    profile.append("user_website", user.organizationSite);
    profile.append("user_skype", user.skype);
    profile.append("twitter", user.twitter);
    profile.append("facebook", user.facebook);
    profile.append("vk", user.vk);
    profile.append("instagram", user.instagram);

    setStateFormData(profile);
  }, [user]);

  function successCallback(message: string) {
    // setRegistrationSuccessText(message);
    addSnackbar({
      context: "success",
      text: message,
    });
    setIsLoading(false);
  }

  function errorCallback(message: string) {
    addSnackbar({
      context: "error",
      text: message,
    });
    setIsLoading(false);
  }

  function validateFormData(formData) {
    let isValid = true;
    clearSnackbar();

    if (!formData.get("first_name") || !formData.get("first_name").trim()) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите имя",
      });
    }

    if (!formData.get("last_name") || !formData.get("last_name").trim()) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите фамилию",
      });
    }

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formRef) {
      return;
    }

    var formData = new FormData(formRef.current);
    setStateFormData(formData);

    if (validateFormData(formData)) {
      setIsLoading(true);
      updateProfileRequest({
        formData,
        successCallbackFn: successCallback,
        errorCallbackFn: errorCallback,
      });
    }
  }

  return (
    <div className="auth-page__illustration-container">
      <div className="auth-page__content auth-page__registration">
        <h1 className="auth-page__title">Данные профиля</h1>
        <div className="auth-page__ornament-container">
          {!!isLoading && (
            <div className="auth-page__loading">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          {!!registrationSuccessText && !isLoading && (
            <div className="auth-page__success-text">
              {registrationSuccessText}
            </div>
          )}
          {!registrationSuccessText && !isLoading && (
            <form
              action=""
              method="post"
              className="auth-page-form"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Ваше имя</label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="first_name"
                  maxLength={50}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("first_name") : ""
                  }
                />
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Фамилия</label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="last_name"
                  maxLength={50}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("last_name") : ""
                  }
                />
              </div>

              <div className="auth-page-form__splitter">
                <div />
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  Название организации
                </label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="user_workplace"
                  maxLength={250}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("user_workplace") : ""
                  }
                />
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  Описание организации
                </label>
                <textarea
                  className="auth-page-form__control-input"
                  name="user_workplace_desc"
                  maxLength={500}
                  rows={6}
                  placeholder=""
                  defaultValue={
                    stateFormData
                      ? stateFormData.get("user_workplace_desc")
                      : ""
                  }
                ></textarea>
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Веб-сайт</label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="user_website"
                  maxLength={500}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("user_website") : ""
                  }
                />
              </div>

              <div className="auth-page-form__splitter">
                <div />
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Skype</label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="user_skype"
                  maxLength={250}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("user_skype") : ""
                  }
                />
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  Twitter (имя пользователя без @)
                </label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="twitter"
                  maxLength={250}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("twitter") : ""
                  }
                />
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  Профиль Facebook (ссылка)
                </label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="facebook"
                  maxLength={250}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("facebook") : ""
                  }
                />
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  Профиль ВКонтакте (ссылка)
                </label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="vk"
                  maxLength={250}
                  placeholder=""
                  defaultValue={stateFormData ? stateFormData.get("vk") : ""}
                />
              </div>

              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  Профиль Instagram (имя пользователя без @)
                </label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="instagram"
                  maxLength={250}
                  placeholder=""
                  defaultValue={
                    stateFormData ? stateFormData.get("instagram") : ""
                  }
                />
              </div>

              <div className="auth-page-form__group">
                <button
                  type="submit"
                  className={`auth-page-form__control-submit`}
                  onClick={handleSubmit}
                >
                  Сохранить
                </button>
              </div>
              <div className="auth-page-form__group center">
                <Link href={`/members/${user.username}`}>
                  <a className="auth-page-form__control-link-go-back">
                    Вернуться в режим просмотра
                  </a>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMemberProfile;
