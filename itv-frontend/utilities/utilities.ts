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

export function showAjaxError(errorData) {
    if(errorData.message) {
        let el = document.createElement('div')
        el.innerHTML = errorData.message
        alert(el.textContent)
    }
    else {
        alert('Ошибка!')
    }

    if(errorData.action) {
        console.log(errorData.action + " failed")
    }

    if(errorData.error) {
        console.log(errorData.error)
    }
}

export function decodeHtmlEntities(textWithEntities) {
  if(!document) {
    return textWithEntities
  }

  try {
    let el = document.createElement("div")
    el.innerHTML = textWithEntities
    return el.innerText
  }
  catch(ex) {
    console.log("decode failed:", ex)
    console.log("source text:", textWithEntities)
    return textWithEntities
  }
}

export function getSiteUrl(path="") {
  if(!window) {
    return path;
  }

  let rootUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  return rootUrl + path;
}