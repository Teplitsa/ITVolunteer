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