import { ReactElement, SyntheticEvent, useRef } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberAccountNeedAttention: React.FunctionComponent = (): ReactElement => {
  const {username, profileFillStatus} = useStoreState(
    (state) => state.components.memberAccount
  );

  if(!profileFillStatus) {
    return null;
  }

  if(profileFillStatus.isAvatarExist && profileFillStatus.isCoverExist && profileFillStatus.isProfileInfoEnough) {
    return null;
  }

  return (
    <div className="member-account-null__need-attention">
      <h3>
        Это ваш личный кабинет и он нуждается в вашем внимании!
        <a className="close" href="#" />
      </h3>
      <ul>
        {!profileFillStatus.isAvatarExist &&
          <li>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              document.getElementById("member-avatar-upload-input").click();
            }}>Добавьте аватарку</a>
            <p>Приятно общаться с человеком, когда видишь его лицо. Согласны?</p>
          </li>
        }
        {!profileFillStatus.isCoverExist &&
          <li>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              document.getElementById("member-cover-upload-input").click();
            }}>Добавьте обложку</a>
            <p>Хотите произвети максимальное впечатление? Украсьте личный кабинет обложкой!</p>
          </li>
        }
        {!profileFillStatus.isProfileInfoEnough &&
        <li>
          <Link href={`/members/${username}/profile`}>
            <a>Отредактируйте профиль</a>
          </Link>
          <p>Добавьте максимальное количество информации. Это позволит лучше с вами познакомиться</p>
        </li>
        }
      </ul>
    </div>
  );
};

export default MemberAccountNeedAttention;
