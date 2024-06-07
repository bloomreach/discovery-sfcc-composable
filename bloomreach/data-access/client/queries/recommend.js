import {useLocation} from 'react-router'
import {useQuery} from '@tanstack/react-query'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {recommendURL as blmApiUrl} from '@bloomreach/constants'
import {parseRecommended} from '@bloomreach/utils'
import React from 'react'
import {
    getQueryParamsSettings,
    getUseQuerySettings
} from '@bloomreach/data-access/client/queries/helpers'

export const useGetRecommended = (params, options) => {
    const location = useLocation()
    const appOrigin = getAppOrigin()

    const apiUrl = `${appOrigin}${blmApiUrl}`

    const queryParams = new URLSearchParams({
        ...getQueryParamsSettings({appOrigin, location}),
        ...params
    })

    return useQuery({
        ...getUseQuerySettings({params, apiUrl, queryParams}),
        select: React.useCallback((data) => parseRecommended(data), []),
        ...options
    })
}
