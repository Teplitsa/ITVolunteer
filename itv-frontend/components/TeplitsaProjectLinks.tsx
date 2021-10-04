import { ReactElement } from "react";

const TeplitsaProjectLinks: React.FunctionComponent = (): ReactElement => {
  const links: Map<string, { title: string; description: string }> = new Map([
    [
      "https://kurs.te-st.ru/",
      { title: "Теплица.Курсы", description: "Для активистов/к и НКО" },
    ],
    ["https://leyka.te-st.ru", { title: "Лейка", description: "Сбор пожертвований на сайте" }],
    ["https://knd.te-st.ru", { title: "Кандинский", description: "Сайт-конструктор для НКО" }],
  ]);

  return (
    <div className="col-projects">
      <h3>Проекты Теплицы</h3>
      <div className="projects">
        {Array.from(links).map(
          ([url, { title, description }], i): ReactElement => {
            return (
              <div className="project" key={i}>
                <a href={url} target="_blank" rel="noreferrer">
                  {title}
                </a>
                <p>{description}</p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default TeplitsaProjectLinks;
