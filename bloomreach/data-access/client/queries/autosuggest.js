import {useLocation} from 'react-router'
import {useQuery} from '@tanstack/react-query'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {DOMAIN_KEY, autosuggestURL} from '@bloomreach/constants'
import {getQueryParamsSettings, getUseQuerySettings} from './helpers'
import {parseSearchSuggestions} from '@bloomreach/utils'
import React from 'react'
import {useCurrency} from '@salesforce/retail-react-app/app/hooks/use-currency'

export const useGetAutosuggestions = (params, options) => {
    const location = useLocation()
    const appOrigin = getAppOrigin()
    const apiUrl = `${appOrigin}${autosuggestURL}`
    const {currency} = useCurrency()

    const queryParams = new URLSearchParams({
        ...getQueryParamsSettings({appOrigin, location}),
        request_type: 'suggest',
        catalog_views: DOMAIN_KEY,
        ...params
    })

    return useQuery({
        ...getUseQuerySettings({params, apiUrl, queryParams}),
        select: React.useCallback((data) => parseSearchSuggestions(data, currency), [currency]),
        ...options
    })
}
