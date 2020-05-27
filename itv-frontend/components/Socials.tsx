import { ReactElement } from "react";

const Socials: React.FunctionComponent = (): ReactElement => {
  const links: Array<{ title: string; url: string }> = [
    { title: "Facebook", url: "https://www.facebook.com/TeplitsaST" },
    { title: "Телеграм", url: "https://teleg.run/teplitsa" },
    { title: "Вконтакте", url: "https://vk.com/teplitsast" },
    { title: "RSS-канал", url: "https://itv.te-st.ru/feed/" },
  ];

  return (
    <div className="col-social">
      <h3>Соцсети</h3>
      <div className="social-links">
        {links.map(
          ({ title, url }, i): ReactElement => {
            return (
              <a key={i} href={url} target="_blank">
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
