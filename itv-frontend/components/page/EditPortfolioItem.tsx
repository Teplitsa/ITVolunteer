import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import PortfolioItemForm from "../PortfolioItemForm";

const EditPortfolioItemPage: React.FunctionComponent = (): ReactElement => {
  const {
    user: { username },
    isAccountOwner,
  } = useStoreState(store => store.session);
  const { slug, title, description, preview, fullImage } = useStoreState(
    store => store.components.portfolioItemForm
  );
  const { updatePortfolioItemRequest } = useStoreActions(
    actions => actions.components.portfolioItemForm
  );

  const updatePortfolioItemData = (portFolioItemData: FormData) => {
    updatePortfolioItemRequest({ slug, inputData: portFolioItemData });
  };

  if (!isAccountOwner) {
    return <p>Доступ запрещён.</p>;
  }

  return (
    <div className="manage-portfolio-item">
      <div className="manage-portfolio-item__content">
        <h1 className="manage-portfolio-item__title">Редактирование работы в портфолио</h1>
        <PortfolioItemForm
          {...{
            title,
            description,
            preview,
            fullImage,
            submitBtnTitle: "Сохранить изменения",
            afterSubmitHandler: updatePortfolioItemData,
          }}
        />
        <div className="manage-portfolio-item__footer">
          <Link href="/members/[username]" as={`/members/${username}`}>
            <a className="manage-portfolio-item__backward-link">Вернуться в Личный кабинет</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolioItemPage;
