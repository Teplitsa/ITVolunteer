import { ReactElement } from "react";
import StepikLogoImage from "../../assets/img/home-partners-stepik.svg";
import HtmlAcademyLogoImage from "../../assets/img/home-partners-html-academy.svg";
import KislorodIoLogoImage from "../../assets/img/home-partners-kislorod-io.svg";
import ImpactHubLogoImage from "../../assets/img/home-partners-impact-hub.svg";

const partners = [
  {
    image: StepikLogoImage,
    description: "HTML Academy – современные интерактивные онлайн-курсы для начала карьеры в IT",
  },
  {
    image: HtmlAcademyLogoImage,
    description: "PILnet – сообщество юристов, которые помогают некоммерческим организациям бесплатно",
  },
  {
    image: KislorodIoLogoImage,
    description: "HTML Academy – современные интерактивные онлайн-курсы для начала карьеры в IT",
  },
  {
    image: ImpactHubLogoImage,
    description: "PILnet – сообщество юристов, которые помогают некоммерческим организациям бесплатно",
  },
];

const HomePartners: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-partners">
      <h3 className="home-partners__title">Наши партнеры</h3>
      <ul className="home-partners__list">
        {partners.map(({ image, description }, i) => (
          <li key={`PartnerListItem-${i}`} className="home-partners__item">
            <div className="home-partners__item-logo">
              <img src={image} alt="" />
            </div>
            <div className="home-partners__item-description">
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomePartners;
