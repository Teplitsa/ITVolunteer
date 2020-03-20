import React from 'react'

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

    console.log("ajaxurl:", frontend.ajaxurl)
    console.log("url:", url.toString())

    return url.toString()
}
