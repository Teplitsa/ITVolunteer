import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import moment from "moment";
import { decode } from "html-entities";
import * as _ from "lodash";
import Cookies from "js-cookie";
import * as C from "../const";
import { ISessionState } from "model/model.typing";

export const convertObjectToClassName = (classNameMatrix: {
  [className: string]: boolean;
}): string =>
  Object.entries(classNameMatrix)
    .reduce(
      (activeClassList, [className, activityFlag]) =>
        (activityFlag && [...activeClassList, className]) || activeClassList,
      []
    )
    .join(" ");

export const convertDateToLocalISOString = ({
  date,
  locale = "ru-RU",
}: {
  date: Date;
  locale?: string;
}) => {
  if (!(date instanceof Date)) return;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(/^(\d{2})\.(\d{2})\.(\d{4})$/g, "$3-$2-$1");
};

export const decodeSpecialChars = (html: string): string => {
  if (typeof html !== "string" || html.trim().length === 0) return html;

  return decode(html);
};

export const isLinkValid = (link: string): boolean => {
  let isValid = false;

  try {
    if (new URL(link)) {
      isValid = true;
    }
    // eslint-disable-next-line no-empty
  } catch {}

  return isValid;
};

export const convertUrlToAnchor = ({ html }: { html: string }): string => {
  if (typeof html !== "string" || html.trim().length === 0) return html;

  const urlList: Array<string> = html.match(
    /(?:(?:http|https):\/\/)(?:www\.){0,1}(?:[-a-z0-9]+)(?:\.[-a-z0-9]+)*\.(?:[a-z]{2,})(?:\/[-_a-z0-9]+)*\/*/gi
  );

  if (Object.is(null, urlList)) return html;

  urlList.forEach(url => {
    html = html.replace(url, () =>
      isLinkValid(url) ? `<a href="${url}" target="_blank">${url}</a>` : url
    );
  });

  return html;
};

export const generateUniqueKey = ({ base, prefix = "" }: { base: string; prefix?: string }) => {
  return (
    (prefix ? `${prefix}-` : "") +
    Array.from(base).reduce(
      (result, char) => (/[a-zа-я]/i.test(char) && result + char.charCodeAt(0)) || result,
      0
    )
  );
};

export const getLocaleDateTimeISOString = (locale = "ru-RU"): string => {
  switch (locale) {
    case "ru-RU":
      return new Date().toISOString().replace(/^(.{10})T(.{8}).*/, "$1 $2");
  }
};

export const stripTags = (str = "") => str.replace(/<\/?[^>]+>/gi, "");

export const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

export const toCamelCase = (str = ""): string =>
  str.replace(/\W+(.)/g, (match, char) => char.toUpperCase());

export const getTheDate = ({
  dateString = new Date().toISOString(),
  stringFormat = "do MMMM Y",
}): string => {
  try {
    return format(itvWpDateTimeToDate(dateString), stringFormat, {
      locale: ru,
    });
  } catch (e) {
    throw new TypeError(`Instead of valid date string given: ${dateString}`);
  }
};

export const formatDate = ({ date = new Date(), stringFormat = "do MMMM Y" }): string => {
  return format(date, stringFormat, {
    locale: ru,
  });
};

export function itvWpDateTimeToDate(wpDateTime) {
  if (wpDateTime) {
    wpDateTime = wpDateTime.replace(/(^\d+-\d+-\d+)(.*?)(\d+:\d+:\d+.*)$/, "$1 $3");

    if (!wpDateTime.match(/.*[Z]{1}$/)) {
      if (wpDateTime.match(/\d+-\d+-\d+ \d+:\d+:\d+.*$/)) {
        wpDateTime += "Z";
      }
    }
  }

  return moment(wpDateTime).toDate();
}

export const getTheIntervalToNow = ({
  fromDateString = new Date().toISOString(),
}: {
  fromDateString: string;
}): string => {
  try {
    return formatDistanceToNow(itvWpDateTimeToDate(fromDateString), {
      locale: ru,
      addSuffix: true,
    });
  } catch (e) {
    throw new TypeError(`Instead of valid date string given: ${fromDateString}`);
  }
};

export const formatIntervalToNow = ({ fromDate = new Date() }): string => {
  return formatDistanceToNow(fromDate, {
    locale: ru,
    addSuffix: true,
  });
};

export const getAjaxUrl = (action: string): string => {
  const url = new URL(process.env.AjaxUrl);
  url.searchParams.set("action", action);
  return url.toString();
};

export const getLoginUrl = (): string => {
  const url = new URL(process.env.LoginUrl);
  return url.toString();
};

export const getRestApiUrl = (route: string): string => {
  const url = new URL(process.env.RestApiUrl + route);
  return url.toString();
};

export function showAjaxError(errorData) {
  if (errorData.message) {
    const el = document.createElement("div");
    el.innerHTML = errorData.message;
    console.error(el.textContent);
  } else {
    console.error("Ошибка!");
  }

  if (errorData.action) {
    console.error(errorData.action + " failed");
  }

  if (errorData.error) {
    console.error(errorData.error);
  }
}

export function decodeHtmlEntities(textWithEntities) {
  if (typeof document === "undefined" || !document) {
    return textWithEntities;
  }

  try {
    const el = document.createElement("div");
    el.innerHTML = textWithEntities;
    return el.innerText;
  } catch (ex) {
    console.error("decode failed:", ex);
    console.error("source text:", textWithEntities);
    return textWithEntities;
  }
}

export function getSiteUrl(path = "") {
  if (typeof window === "undefined" || !window) {
    return path;
  }

  const rootUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
  return rootUrl + path;
}

export function formDataToJSON(formData) {
  const object = {};
  formData.forEach((value, key) => {
    // Reflect.has in favor of: object.hasOwnProperty(key)
    if (!Reflect.has(object, key)) {
      object[key] = value;
      return;
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]];
    }
    object[key].push(value);
  });
  return JSON.stringify(object);
}

export function getPostFeaturedImageUrlBySize(postFeaturedImage, size) {
  if (!postFeaturedImage) {
    return "";
  }

  let fallbackImageUrl = "";
  if (postFeaturedImage.mediaItemUrl) {
    fallbackImageUrl = postFeaturedImage.mediaItemUrl;
  }

  if (!postFeaturedImage.mediaDetails || !postFeaturedImage.mediaDetails.sizes) {
    return fallbackImageUrl;
  }

  const foundSize = postFeaturedImage.mediaDetails.sizes.find(imgSize => imgSize.name == size);
  return foundSize ? foundSize.sourceUrl : fallbackImageUrl;
}

export function getDeclension({
  count,
  caseOneItem,
  caseTwoThreeFourItems,
  restCases,
}: {
  count: number;
  caseOneItem: string;
  caseTwoThreeFourItems: string;
  restCases: string;
}): string {
  const reviewsCountModulo = count < 10 ? count : Number([...Array.from(String(count))].pop());

  const reviewsCountModulo100 =
    count < 10 ? count : Number([...Array.from(String(count))].slice(-2).join(""));

  if (reviewsCountModulo100 > 10 && reviewsCountModulo100 < 20) {
    return restCases;
  }

  if (reviewsCountModulo === 1) {
    return caseOneItem;
  }

  if ([2, 3, 4].includes(reviewsCountModulo)) {
    return caseTwoThreeFourItems;
  }

  return restCases;
}

export function getProjectCountString(projectCount: number): string {
  return getDeclension({
    count: projectCount,
    caseOneItem: "проект",
    caseTwoThreeFourItems: "проекта",
    restCases: "проектов",
  });
}

export function getReviewsCountString(reviewsCount: number): string {
  return getDeclension({
    count: reviewsCount,
    caseOneItem: "отзыв",
    caseTwoThreeFourItems: "отзыва",
    restCases: "отзывов",
  });
}

export function getGraphQLClientTokenHeader(session, headers = null) {
  if (!headers) {
    headers = {};
  }

  headers = {
    ...headers,
    Authorization: "Bearer " + session.token.authToken,
  };
  return headers;
}

export async function tokenFetch(url, options = {}) {
  _.set(options, "headers.Authorization", "Bearer " + Cookies.get(C.ITV_COOKIE.AUTH_TOKEN.name));
  return await fetch(url, options);
}

export async function sessionFetch(url, session: ISessionState, options = {}) {
  if (session.user.databaseId) {
    _.set(options, "headers.Authorization", "Bearer " + session.token.authToken);
  }
  return await fetch(url, options);
}

export function customizeGraphQLQueryFields(anyState: any, customFields: any, filterexFields?: Array<string>): Array<string> {
  return [
    ...Object.keys(anyState).filter(
      key =>
        !Object.keys(customFields).includes(key) && (!filterexFields || !filterexFields.includes(key))
    ),
    ...Object.keys(customFields).map(fieldName => `${fieldName} ${customFields[fieldName] ?? ""}`)
  ];
}