import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { TelegramChatButton } from "../../TelegramChat";
import { regEvent } from "../../../utilities/ga-events";
import Logo from "../../../assets/img/pic-logo-itv.svg";

const FooterNav: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();

  return (
    <div className="header">
      <Link href="/">
        <a className="logo-col">
          <img src={Logo} className="logo" alt="IT-волонтер" />
        </a>
      </Link>
      <TelegramChatButton />
      <ul className="links-col">
        <li>
          <Link href="/tasks">
            <a
              onClick={() => {
                regEvent("m_tf_list", router);
              }}
            >
              Задачи
            </a>
          </Link>
        </li>
        <li>
          <Link href="/members">
            <a
              onClick={() => {
                regEvent("m_mb_list", router);
              }}
            >
              Волонтёры
            </a>
          </Link>
        </li>
        <li className="drop-menu">
          <a href="#" onClick={event => event.preventDefault()}>
            О проекте
          </a>
          <ul className="submenu">
            <li>
              <Link href="/about">
                <a
                  onClick={() => {
                    regEvent("m_about", router);
                  }}
                >
                  О проекте
                </a>
              </Link>
            </li>
            <li>
              <Link href="/conditions">
                <a>Правила участия</a>
              </Link>
            </li>
            <li>
              <Link href="/about-paseka">
                <a>Пасека</a>
              </Link>
            </li>
            <li>
              <Link href="/nagrady">
                <a>Награды</a>
              </Link>
            </li>
            <li>
              <Link href="/news">
                <a>Новости</a>
              </Link>
            </li>
            <li>
              <Link href="/sovety-dlya-nko-uspeshnye-zadachi">
                <a>Советы НКО</a>
              </Link>
            </li>
            <li>
              <Link href="/contacts">
                <a>Контакты</a>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default FooterNav;
