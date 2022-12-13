import { ReactElement } from "react";
import LogoTeplitsa from "../assets/img/pic-logo-teplitsa.svg";

const Copyright: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="owner">
      <div className="col-text">
        <p>
          Платформа «IT-волонтер» – проект{" "}
          <a href="https://te-st.org" target="_blank" rel="noreferrer">
            Теплицы социальных технологий
          </a>
        </p>
        <p>
          Материалы сайта доступны по лицензии{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.ru"
            target="_blank"
            rel="noreferrer"
          >
            Creative Commons СС-BY-SA. 4.0
          </a>
        </p>
      </div>
      <a href="https://te-st.org" className="col-logo">
        <img src={LogoTeplitsa} className="logo" alt="Теплица социальных технологий" />
      </a>
    </div>
  );
};

export default Copyright;
