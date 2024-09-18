import {useLocation} from 'react-router'
import {useQuery} from '@tanstack/react-query'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {apiURL as blmApiUrl} from '@bloomreach/constants'
import {
    getQueryParamsSettings,
    getUseQuerySettings
} from '@bloomreach/data-access/client/queries/helpers'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

export const useGetContent = (params, options) => {
    const location = useLocation()
    const appOrigin = getAppOrigin()

    const apiUrl = `${appOrigin}${blmApiUrl}`
    const {app: appConfig} = getConfig()

    const queryParams = new URLSearchParams({
        ...getQueryParamsSettings({appOrigin, location, appConfig}),
        request_type: 'search',
        search_type: 'keyword',
        fl: 'pid,item_id,item_title,title,thumb_image,url,description',
        catalog_name: appConfig?.blm?.catalogName,
        ...params
    })

    return useQuery({
        ...getUseQuerySettings({params, apiUrl, queryParams}),
        ...options
    })
}
