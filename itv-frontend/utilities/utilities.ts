import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

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

// export function wpDateTimeToDate(wpDateTime) {
//     return new Date(moment(wpDateTime + "Z"))
// }