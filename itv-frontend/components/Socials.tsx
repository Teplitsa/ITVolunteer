import { ReactElement } from "react";

const Socials: React.FunctionComponent = (): ReactElement => {
  const links: Array<{ title: string; url: string }> = [
    { title: "Телеграм", url: "https://t.me/itvolunteers" },
    { title: "Вконтакте", url: "https://vk.com/teplitsast" },
    { title: "RSS-канал", url: "https://itvist.org/feed/" },
  ];

  return (
    <div className="col-social">
      <h3>Соцсети</h3>
      <div className="social-links">
        {links.map(
          ({ title, url }, i): ReactElement => {
            return (
              <a key={i} href={url} target="_blank" rel="noreferrer">
                {title}
              </a>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Socials;
