import { ReactElement } from "react";
import Link from "next/link";

const SimpleTaskExplanation: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <p>
        Например: создать сайт-визитку, нарисовать логотип, подключить аналитику. Если вам нужно
        решить несколько вопросов сразу, поставьте несколько задач — так больше шансов на отклик.
      </p>
      <Link href="/sovety-dlya-nko-uspeshnye-zadachi">
        <a target="_blank">Как ставить задачи, на которые откликнутся</a>
      </Link>
    </>
  );
};

export default SimpleTaskExplanation;
