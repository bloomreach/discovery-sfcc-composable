import {ACCOUNT_ID, AUTH_KEY, DOMAIN_KEY} from '@bloomreach/constants'
import random from 'lodash/random'
import Cookies from 'js-cookie'

// Generate unique 13 digit integer number for requests
export const getRequestID = () => random(1000000000000, 9999999999999)

// TODO: Docs says this should come from the BrTrk script however currently when we call window.BrTrk.getTracker().getCookie() we get an empty result of ''
export const getBrUid = () =>
    Cookies?.get('_br_uid_2') || 'uid=7797686432023:v=11.5:ts=1428617911187:hc=55'

export const getUrls = (appOrigin, location) => {
    const url = `${appOrigin}${location.pathname}${location.search}${location.hash}`
    const {
        pathname: refPathName = '',
        search: refSearch = '',
        hash: refHash = ''
    } = location?.state?.referrer || {}
    const ref_url = `${appOrigin}${refPathName}${refSearch}${refHash}`

    return {
        url,
        ref_url
    }
}

export const getQueryParamsSettings = ({appOrigin, location}) => {
    const {url, ref_url} = getUrls(appOrigin, location)

    return {
        auth_key: AUTH_KEY,
        account_id: ACCOUNT_ID,
        domain_key: DOMAIN_KEY,
        request_id: getRequestID(),
        _br_uid_2: getBrUid(),
        ref_url,
        url
    }
}

export const getUseQuerySettings = ({params, apiUrl, queryParams}) => {
    return {
        queryKey: [JSON.stringify(params)],
        queryFn: async () => {
            const apiUrlWithParams = `${apiUrl}?${queryParams}`
            const response = await fetch(apiUrlWithParams)

            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`)
            }

            return response.json()
        }
    }
}
