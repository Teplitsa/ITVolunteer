import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberAccountNeedAttention: React.FunctionComponent = (): ReactElement => {
  const { slug, profileFillStatus, isNeedAttentionPanelClosed } = useStoreState(
    state => state.components.memberAccount
  );
  const {
    setIsNeedAttentionPanelClosed,
    storeIsNeedAttentionPanelClosed,
    loadIsNeedAttentionPanelClosed,
  } = useStoreActions(actions => actions.components.memberAccount);

  useEffect(() => {
    loadIsNeedAttentionPanelClosed();
  }, []);

  if (!profileFillStatus) {
    return null;
  }

  if (isNeedAttentionPanelClosed) {
    return null;
  }

  if (
    profileFillStatus.isAvatarExist &&
    profileFillStatus.isCoverExist &&
    profileFillStatus.isProfileInfoEnough
  ) {
    return null;
  }

  return (
    <div className="member-account-null__need-attention">
      <h3>
        Заполните профиль, чтобы получать больше внимания
        <a
          className="close"
          href="#"
          onClick={e => {
            e.preventDefault();
            setIsNeedAttentionPanelClosed(true);
            storeIsNeedAttentionPanelClosed();
          }}
        />
      </h3>
      <ul>
        {!profileFillStatus.isAvatarExist && (
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                document.getElementById("member-avatar-upload-input").click();
              }}
            >
              Загрузите фото.
            </a>
            <p>Людям приятно видеть собеседника.</p>
          </li>
        )}
        {!profileFillStatus.isCoverExist && (
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                document.getElementById("member-cover-upload-input").click();
              }}
            >
              Добавьте обложку профиля,
            </a>
            <p>чтобы задать настроение и запомниться.</p>
          </li>
        )}
        {!profileFillStatus.isProfileInfoEnough && (
          <li>
            <Link href={`/members/${slug}/profile`}>
              <a>Расскажите о себе.</a>
            </Link>
            <p>Чем вы занимаетесь? Чем можете быть полезны?</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MemberAccountNeedAttention;
