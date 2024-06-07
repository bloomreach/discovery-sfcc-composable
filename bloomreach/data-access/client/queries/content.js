import {useLocation} from 'react-router'
import {useQuery} from '@tanstack/react-query'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {apiURL as blmApiUrl, CATALOG_NAME} from '@bloomreach/constants'
import {
    getQueryParamsSettings,
    getUseQuerySettings
} from '@bloomreach/data-access/client/queries/helpers'

export const useGetContent = (params, options) => {
    const location = useLocation()
    const appOrigin = getAppOrigin()

    const apiUrl = `${appOrigin}${blmApiUrl}`

    const queryParams = new URLSearchParams({
        ...getQueryParamsSettings({appOrigin, location}),
        request_type: 'search',
        search_type: 'keyword',
        fl: 'pid,item_id,item_title,title,thumb_image,url,description',
        catalog_name: CATALOG_NAME,
        ...params
    })

    return useQuery({
        ...getUseQuerySettings({params, apiUrl, queryParams}),
        ...options
    })
}
