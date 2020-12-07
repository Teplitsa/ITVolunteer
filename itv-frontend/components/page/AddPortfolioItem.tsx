import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import PortfolioItemForm from "../PortfolioItemForm";

const AddPortfolioItemPage: React.FunctionComponent = (): ReactElement => {
  const {
    user: { username },
    isAccountOwner,
  } = useStoreState(store => store.session);

  const savePortFolioItemData = (portFolioItemData: FormData) => {
    console.log(Array.from(portFolioItemData));
  };

  return (
    (isAccountOwner && (
      <div className="manage-portfolio-item">
        <div className="manage-portfolio-item__content">
          <h1 className="manage-portfolio-item__title">Добавление работы в портфолио</h1>
          <PortfolioItemForm afterSubmitHandler={savePortFolioItemData} />
          <div className="manage-portfolio-item__footer">
            <Link href="/members/[username]" as={`/members/${username}`}>
              <a className="manage-portfolio-item__backward-link">Вернуться в Личный кабинет</a>
            </Link>
          </div>
        </div>
      </div>
    )) || <p>Доступ запрещён.</p>
  );
};

export default AddPortfolioItemPage;
