import React from 'react'
import moment from 'moment'

export function loadingWait() {
    return (
        <span className="loading wait">Загрузка...</span>
    )
}

export function loadingError(error) {
    return (
        <span className="loading error">
            `Ошибка: ${error.message}`
        </span>        
    )
}

export function itvSiteUrl(path) {
    return frontend.site_url + path.replace(/^\//, '')
}

export function itvAjaxUrl(action) {
    let url = new URL(frontend.ajaxurl)
    url.searchParams.set('action', action)
    return url.toString()
}

export function itvShowAjaxError(errorData) {
    let $ = jQuery;
    if(errorData.message) {
        // alert($('<div>').html(errorData.message).text())
        console.log($('<div>').html(errorData.message).text())
    }
    else {
        // alert('Ошибка!')
        console.log('Ошибка!')
    }

    if(errorData.action) {
        console.log(errorData.action + " failed")
    }

    if(errorData.error) {
        console.log(errorData.error)
    }
}

export function itvShowActionSuccess(actionData) {
    if(actionData.message) {
        alert(actionData.message)
    }

    if(actionData.action) {
        console.log(actionData.action + " success")
    }
}

export function itvShowActionError(message) {
    if(actionData.message) {
        alert(actionData.message)
    }
}

export function itvWpDateTimeToDate(wpDateTime) {
    return new Date(moment(wpDateTime + "Z"))
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
