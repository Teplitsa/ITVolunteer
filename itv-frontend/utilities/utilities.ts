import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import moment from "moment";

export const generateUniqueKey = ({
  base,
  prefix = "",
}: {
  base: string;
  prefix?: string;
}) => {
  return (
    (prefix ? `${prefix}-` : "") +
    Array.from(base).reduce(
      (result, char) =>
        (/[a-zа-я]/i.test(char) && result + char.charCodeAt(0)) || result,
      0
    )
  );
};

export const getLocaleDateTimeISOString = (locale = "ru-RU"): string => {
  switch (locale) {
    case "ru-RU":
      return new Date()
        .toLocaleString()
        .replace(/(\d{2})\.(\d{2})\.(\d{4}),\s([\d|:]+)/g, "$3-$2-$1 $4");
  }
};

export const stripTags = (str = "") => str.replace(/<\/?[^>]+>/gi, "");

export const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

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

export const formatDate = ({
  date = new Date(),
  stringFormat = "do MMMM Y",
}): string => {
  return format(date, stringFormat, {
    locale: ru,
  });
};

export function itvWpDateTimeToDate(wpDateTime) {
  if(wpDateTime && !wpDateTime.match(/.*[Z]{1}$/)) {
    if(wpDateTime.match(/\d+-\d+-\d+ \d+:\d+:\d+.*$/)) {
      wpDateTime += "Z"
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
    throw new TypeError(
      `Instead of valid date string given: ${fromDateString}`
    );
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

export function showAjaxError(errorData) {
  if (errorData.message) {
    let el = document.createElement("div");
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
  if (!document) {
    return textWithEntities;
  }

  try {
    let el = document.createElement("div");
    el.innerHTML = textWithEntities;
    return el.innerText;
  } catch (ex) {
    console.error("decode failed:", ex);
    console.error("source text:", textWithEntities);
    return textWithEntities;
  }
}

export function getSiteUrl(path = "") {
  if (!window) {
    return path;
  }

  let rootUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
  return rootUrl + path;
}
