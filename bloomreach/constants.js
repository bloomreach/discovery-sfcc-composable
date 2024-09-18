import {
    DEFAULT_LIMIT_VALUES,
    DEFAULT_SEARCH_PARAMS
} from '@salesforce/retail-react-app/app/constants'

/**
 * - For proxying through Managed Runtime (can help bypass ad-blockers):
 *     use `mobify/proxy/` for no MRT caching,
 *     use `mobify/caching/` to leverage a cachable cdn response
 */
export const apiURL = '/mobify/proxy/bloomreach/api/v1/core/'
export const autosuggestURL = '/mobify/proxy/bloomreach-autosuggest/api/v2/suggest/'
export const widgetBaseURL = '/mobify/proxy/bloomreach-recommends/api/v2/widgets/'

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

export const PRODUCT_SUGGEST_COUNT = 4
export const PRODUCT_SUGGEST_IMAGE_WIDTH = 50
