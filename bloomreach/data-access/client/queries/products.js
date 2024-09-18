import {useLocation} from 'react-router'
import {useQuery} from '@tanstack/react-query'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {apiURL as blmApiUrl, SEARCH_PARAMS_SETTINGS} from '@bloomreach/constants'
import {parseResponseToMatchDefaultFormat} from '@bloomreach/utils'
import {useSearchParams} from '@salesforce/retail-react-app/app/hooks'
import React from 'react'
import {
    getQueryParamsSettings,
    getUseQuerySettings
} from '@bloomreach/data-access/client/queries/helpers'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

export const useGetProductsByFilters = (params) => {
    const location = useLocation()
    const appOrigin = getAppOrigin()
    const [searchParams] = useSearchParams(SEARCH_PARAMS_SETTINGS)

    const apiUrl = `${appOrigin}${blmApiUrl}`

    const {app: appConfig} = getConfig()

    const queryParams = new URLSearchParams({
        ...getQueryParamsSettings({appOrigin, location, appConfig}),
        request_type: 'search',
        fl: 'pid,title,brand,price,sale_price,thumb_image,url,description',
        // We need this line to include price in the refinement result options
        'facet.range': 'price',
        ...params
    })

    return useQuery({
        ...getUseQuerySettings({params, apiUrl, queryParams}),
        select: React.useCallback(
            (data) => parseResponseToMatchDefaultFormat(data, searchParams),
            [searchParams]
        )
    })
}
