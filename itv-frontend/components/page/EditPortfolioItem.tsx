import { ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import PortfolioItemForm from "../PortfolioItemForm";

const SubmitBtnTitle: React.FunctionComponent = (): ReactElement => {
  return <>{"Сохранить изменения"}</>;
};

const EditPortfolioItemPage: React.FunctionComponent = (): ReactElement => {
  const {
    user: { slug: userSlug },
  } = useStoreState(store => store.session);
  const { slug, title, description, preview, fullImage } = useStoreState(
    store => store.components.portfolioItemForm
  );
  const { updatePortfolioItemRequest } = useStoreActions(
    actions => actions.components.portfolioItemForm
  );
  const router = useRouter();

  const updatePortfolioItemData = (portFolioItemData: FormData) => {
    updatePortfolioItemRequest({
      slug,
      inputData: portFolioItemData,
      successCallbackFn: () => router.push(`/members/${userSlug}/${slug}`),
    });
  };

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
            submitBtnTitle: SubmitBtnTitle,
            afterSubmitHandler: updatePortfolioItemData,
          }}
        />
        <div className="manage-portfolio-item__footer">
          <Link href="/members/[username]" as={`/members/${userSlug}`}>
            <a className="manage-portfolio-item__backward-link">Вернуться в Личный кабинет</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolioItemPage;
