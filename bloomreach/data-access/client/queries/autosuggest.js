import {useLocation} from 'react-router'
import {useQuery} from '@tanstack/react-query'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {autosuggestURL} from '@bloomreach/constants'
import {getQueryParamsSettings, getUseQuerySettings} from './helpers'
import {parseSearchSuggestions} from '@bloomreach/utils'
import React from 'react'
import {useCurrency} from '@salesforce/retail-react-app/app/hooks/use-currency'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

export const useGetAutosuggestions = (params, options) => {
    const location = useLocation()
    const appOrigin = getAppOrigin()
    const apiUrl = `${appOrigin}${autosuggestURL}`
    const {currency} = useCurrency()

    const {app: appConfig} = getConfig()

    const queryParams = new URLSearchParams({
        ...getQueryParamsSettings({appOrigin, location, appConfig}),
        request_type: 'suggest',
        catalog_views: appConfig?.blm?.userId,
        ...params
    })

    return useQuery({
        ...getUseQuerySettings({params, apiUrl, queryParams}),
        select: React.useCallback((data) => parseSearchSuggestions(data, currency), [currency]),
        ...options
    })
}
