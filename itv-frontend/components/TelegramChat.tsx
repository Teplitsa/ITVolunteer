import { ReactElement, MouseEvent } from "react";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import { VOLUNTEER_TELEGRAM_CHAT_URL } from "../const";

export const TelegramChatButton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="telegram-chat telegram-chat_button">
      <a
        className="telegram-chat__link"
        href={VOLUNTEER_TELEGRAM_CHAT_URL}
        target="_blank"
        rel="noreferrer"
      >
        Присоединяйся к чату волонтёров
      </a>
    </div>
  );
};

export const TelegramChatBanner: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const itvRole = useStoreState(state => state.session.user.itvRole);
  const hideTelegramChatBanner = useStoreState(state => state.session.user.hideTelegramChatBanner);

  const saveTelegramChatBanner = useStoreActions(actions => actions.session.saveTelegramChatBanner);

  const closeBannerHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    saveTelegramChatBanner({ value: 1 });
  };

  if (!isLoggedIn || itvRole !== "doer" || hideTelegramChatBanner) return null;

  return (
    <div className="telegram-chat telegram-chat_banner">
      <div className="telegram-chat__notice">
        <p>
          <span>Есть&nbsp;вопросы&nbsp;по&nbsp;задачам?&nbsp;</span>
          <span>
            Задайте&nbsp;их&nbsp;в&nbsp;чате:&nbsp;
            <a href={VOLUNTEER_TELEGRAM_CHAT_URL} target="_blank" rel="noreferrer">
              {new URL(VOLUNTEER_TELEGRAM_CHAT_URL).hostname +
                new URL(VOLUNTEER_TELEGRAM_CHAT_URL).pathname}
            </a>
          </span>
        </p>
      </div>
      <button className="telegram-chat__close" type="button" onClick={closeBannerHandler} />
    </div>
  );
};
