import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

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
    return format(new Date(dateString), stringFormat, {
      locale: ru,
    });
  } catch (e) {
    throw new TypeError(`Instead of valid date string given: ${dateString}`);
  }
};

export const getTheIntervalToNow = ({
  fromDateString = new Date().toISOString(),
}): string => {
  try {
    return formatDistanceToNow(new Date(fromDateString), {
      locale: ru,
      addSuffix: true,
    });
  } catch (e) {
    throw new TypeError(
      `Instead of valid date string given: ${fromDateString}`
    );
  }
};

export const getAjaxUrl = (action: string): string => {
  const url = new URL(process.env.AjaxUrl);
  url.searchParams.set("action", action);
  return url.toString();
};

export default {
  getLocaleDateTimeISOString,
  stripTags,
  capitalize,
  toCamelCase,
  getTheDate,
  getTheIntervalToNow,
  getAjaxUrl,
};
