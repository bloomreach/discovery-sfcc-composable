import {
    DEFAULT_LIMIT_VALUES,
    DEFAULT_SEARCH_PARAMS
} from '@salesforce/retail-react-app/app/constants'

/**
 * Bloomreach Account Config values
 */

export const ACCOUNT_ID = process.env.accountId
export const AUTH_KEY = process.env.authKey
export const DOMAIN_KEY = process.env.userId
export const CATALOG_NAME = process.env.catalogName
export const WIDGET_RECOMMEND_ID = process.env.widgetRecommendId
export const DEBUG = process.env.debug
export const TEST_DATA = process.env.testData

/**
 * Bloomreach Pixel Script source
 * - For loading directly from Bloomreach: `https://cdn.brcdn.com/v1/br-trk-${accountId}.js`
 * - For proxying through Managed Runtime (can help bypass ad-blockers):
 *     use `mobify/proxy/` for no MRT caching,
 *     use `mobify/caching/` to leverage a cachable cdn response
 */
export const scriptUrl = `/mobify/proxy/bloomreach-cdn/v1/br-trk-${ACCOUNT_ID}.js`
export const apiURL = '/mobify/proxy/bloomreach/api/v1/core/'
export const autosuggestURL = '/mobify/proxy/bloomreach-autosuggest/api/v2/suggest/'
export const recommendURL = `/mobify/proxy/bloomreach-recommends/api/v2/widgets/item/${WIDGET_RECOMMEND_ID}`

// Bloomreach Pixel scripts loading status
export const STATUS = {
    INIT: 'init',
    LOADING: 'loading',
    LOADED: 'loaded',
    ERROR: 'error'
}

export const EXCLUDED_LIST = ['color_groups']

export const ATTR_MAP = new Map([
    ['category', 'cgid'],
    ['colors', 'c_refinementColor'],
    ['sizes', 'c_size'],
    ['brand', 'brand'],
    ['price', 'price']
])

export const SEARCH_PARAMS_SETTINGS = {...DEFAULT_SEARCH_PARAMS, limit: DEFAULT_LIMIT_VALUES[0]}

export const SORT_OPTIONS = [
    {id: 'best-matches', label: 'Best Matches'},
    {id: 'title asc', label: 'Product Name A - Z'},
    {id: 'title desc', label: 'Product Name Z - A'},
    {id: 'price asc', label: 'Price Low To High'},
    {id: 'price desc', label: 'Price High To Low'}
]

export const SUGGESTION_TYPE_KEYS = [
    {key: 'phraseSuggestions', title: 'Do you mean?'},
    {key: 'categorySuggestions', title: 'Categories'},
    {key: 'productSuggestions', title: 'Products'}
]
