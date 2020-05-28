import { ReactElement } from "react";

const TeplitsaProjectLinks: React.FunctionComponent = (): ReactElement => {
  const links: Map<string, { title: string; description: string }> = new Map([
    [
      "https://knd.te-st.ru",
      { title: "Кандинский", description: "Сайт-конструктор для НКО" },
    ],
    [
      "https://audit.te-st.ru",
      { title: "Аудит", description: "Интерактивная система аудита сайта НКО" },
    ],
    [
      "https://leyka.te-st.ru",
      { title: "Лейка", description: "Сбор пожертвований на сайте" },
    ],
    [
      "https://teplo.social",
      {
        title: "Онлайн курс",
        description: "Как создать, развивать и продвигать сайт НКО",
      },
    ],
  ]);

  return (
    <div className="col-projects">
      <h3>Проекты Теплицы</h3>
      <div className="projects">
        {Array.from(links).map(
          ([url, { title, description }], i): ReactElement => {
            return (
              <div className="project" key={i}>
                <a href={url} target="_blank">
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