import {useLocation} from 'react-router'
import {useQuery} from '@tanstack/react-query'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {widgetBaseURL} from '@bloomreach/constants'
import {parseWidgetResponse} from '@bloomreach/utils'
import React from 'react'
import {
    getQueryParamsSettings,
    getUseQuerySettings
} from '@bloomreach/data-access/client/queries/helpers'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

export const useGetWidgetData = ({params, options, widgetSettings}) => {
    const location = useLocation()
    const appOrigin = getAppOrigin()

    const {id, type} = widgetSettings
    const apiUrl = `${appOrigin}${widgetBaseURL}${type}/${id}`

    const {app: appConfig} = getConfig()

    const queryParams = new URLSearchParams({
        ...getQueryParamsSettings({appOrigin, location, appConfig}),
        ...params
    })

    return useQuery({
        ...getUseQuerySettings({params, apiUrl, queryParams}),
        select: React.useCallback((data) => parseWidgetResponse(data), []),
        ...options
    })
}
