import { ReactElement } from "react";
import LogoTeplitsa from "../assets/img/pic-logo-teplitsa.svg";

const Copyright: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="owner">
      <div className="col-text">
        <p>Теплица социальных технологий.</p>
        <p>
          Материалы сайта доступны по лицензии Creative Commons СС-BY-SA. 3.0
        </p>
      </div>
      <a href="https://te-st.ru" className="col-logo">
        <img
          src={LogoTeplitsa}
          className="logo"
          alt="Теплица социальных технологий"
        />

      </a>
    </div>
  );
};

export default Copyright;
