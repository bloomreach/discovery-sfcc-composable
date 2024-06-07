import isEmpty from 'lodash/isEmpty'
import {DEFAULT_LIMIT_VALUES} from '@salesforce/retail-react-app/app/constants'
import {ATTR_MAP, EXCLUDED_LIST, SORT_OPTIONS} from './constants'

const getKeyByValue = (map, searchValue) => {
    for (let [key, value] of map) {
        if (value === searchValue) {
            return key
        }
    }
    // If the value is not found, return undefined or handle as needed
    return undefined
}

const mapFacetsToAttributes = (facetField, facetValues) => {
    const result = {attributeId: facetField, label: facetField, values: facetValues}

    switch (facetField) {
        case 'category':
            {
                const hierarchyArray = createHierarchy(facetValues)
                if (hierarchyArray.length) {
                    result.attributeId = 'cgid'
                    // Element with index 0 is root category which should be omitted
                    result.values = [...hierarchyArray[0].values]
                }
            }
            break
        case 'colors':
            result.attributeId = 'c_refinementColor'
            result.values = facetValues.map((facetValue) => {
                return {
                    hitCount: facetValue.count,
                    presentationId: facetValue.name,
                    label: facetValue.name,
                    value: facetValue.name
                }
            })
            break
        case 'sizes':
            result.attributeId = 'c_size'
            result.values = facetValues.map((facetValue) => {
                return {
                    hitCount: facetValue.count,
                    label: facetValue.name,
                    value: facetValue.name
                }
            })
            break
        case 'brand':
            result.values = facetValues.map((facetValue) => {
                return {
                    hitCount: facetValue.count,
                    label: facetValue.name,
                    value: facetValue.name
                }
            })
            break
        case 'price':
            result.values = facetValues.map((facetValue) => {
                return {
                    hitCount: facetValue.count,
                    label: `${facetValue.start} - ${facetValue.end}`,
                    value: `[${facetValue.start} TO ${facetValue.end}]`
                }
            })
            break
    }

    return result
}

const createHierarchy = (categories, parent = '') => {
    const result = []

    categories.forEach((category) => {
        if (category.parent === parent) {
            const {cat_id, cat_name, count, ...rest} = category
            const children = createHierarchy(categories, cat_id)

            if (children.length > 0) {
                result.push({
                    value: cat_id,
                    label: cat_name,
                    hitCount: count,
                    values: children,
                    ...rest
                })
            } else {
                result.push({
                    value: cat_id,
                    label: cat_name,
                    hitCount: count,
                    ...rest
                })
            }
        }
    })

    return result
}

const transformAttributes = (facetFields) => {
    if (isEmpty(facetFields)) {
        return undefined
    }

    return Object.keys(facetFields)
        .filter(
            (facetField) => !EXCLUDED_LIST.includes(facetField) && facetFields[facetField]?.length
        )
        .map((facetField) => {
            return mapFacetsToAttributes(facetField, facetFields[facetField])
        })
        .toSorted((a, b) => a.label.localeCompare(b.label))
}

const transformProductEntries = (products) => {
    if (isEmpty(products)) {
        return []
    }

    return products.map(({pid, url, title, price, thumb_image}) => {
        return {
            productId: pid,
            productName: title,
            price,
            url,
            image: {
                title: title,
                link: thumb_image,
                alt: title
            }
        }
    })
}

export const getEfqString = (efq) => {
    let result = []

    for (let [key, value] of Object.entries(efq)) {
        // If it is a single value for a refinement(ex. only "black") the value is string, however if they are multiple values then it is an array and we need to check that
        const queryValue = Array.isArray(value) ? value.join(' OR ') : value

        // Example: efq=colors:("white" OR "black")
        result.push(`${getKeyByValue(ATTR_MAP, key)}:(${queryValue})`)
    }

    return result.join(' AND ')
}

const transformSelectedRefinements = (facets) => {
    if (!facets) return null

    const result = {}
    for (let [key, value] of Object.entries(facets)) {
        result[key] = Array.isArray(value) ? value.join('|') : value
    }
    return result
}

export const getSearchParamsSortValue = (searchParams) => searchParams?.sort?.replace(/\+/g, ' ')

export const getSortReplacedPath = (basePath) => {
    let result = basePath
        // The default replacing the PWA uses
        .replace(/(offset)=(\d+)/i, (match, p1, p2) => `${p1}=0`)
        // Sometimes we get different encoding of the blank space of the sort values (Ex: 'price asc') and we need to handle that
        .replace(/%2B|%20/g, '+')
        // There is a bug with __server_only in the default PWA template
        .replace(/__server_only=/g, '__server_only')

    // We need to add the offset if it missing, because useSortUrl hook automatically adds it
    if (!result.includes('offset')) {
        result = result + '&offset=0'
    }

    return result
}

export const parseResponseToMatchDefaultFormat = (productData, searchParams) => {
    const result = {
        hits: transformProductEntries(productData?.response?.docs),
        limit: DEFAULT_LIMIT_VALUES[0],
        refinements: transformAttributes({
            ...productData?.facet_counts?.facet_fields,
            // Price attribute is located in "facet_ranges" instead of "facet_fields"
            ...productData?.facet_counts?.facet_ranges
        }),
        total: productData?.response?.numFound,
        selectedRefinements: transformSelectedRefinements(searchParams?.refine),
        sortingOptions: SORT_OPTIONS,
        selectedSortingOption: getSearchParamsSortValue(searchParams),
        autoCorrectQuery: productData?.autoCorrectQuery,
        didYouMean: productData?.did_you_mean,
        keywordRedirect: productData?.keywordRedirect
    }

    return result
}

export const transformCategorySuggestions = (categorySuggestions) => {
    if (!categorySuggestions?.length) {
        return undefined
    }

    return categorySuggestions.map((categorySuggestion) => {
        return {
            id: categorySuggestion?.value,
            name: categorySuggestion?.name
        }
    })
}

export const transformPhraseSuggestions = (querySuggestions) => {
    if (!querySuggestions?.length) {
        return undefined
    }

    return querySuggestions.map((querySuggestion) => {
        return {
            phrase: querySuggestion?.displayText
        }
    })
}

export const transformProductSuggestions = (searchSuggestions, currency) => {
    if (!searchSuggestions?.length) {
        return undefined
    }

    return searchSuggestions.map((searchSuggestion) => {
        return {
            currency,
            price: searchSuggestion?.sale_price || searchSuggestion?.price,
            productId: searchSuggestion?.pid,
            productName: searchSuggestion?.title
        }
    })
}

export const parseSearchSuggestions = (suggestResponse, currency) => {
    const suggestData = suggestResponse?.suggestionGroups?.[0] || {}
    const {attributeSuggestions = [], querySuggestions = [], searchSuggestions = []} = suggestData

    if (!attributeSuggestions.length && !querySuggestions.length && !searchSuggestions.length) {
        return undefined
    }

    return {
        categorySuggestions: {
            categories: transformCategorySuggestions(attributeSuggestions),
            suggestedPhrases: transformPhraseSuggestions(querySuggestions)
        },
        productSuggestions: {
            products: transformProductSuggestions(searchSuggestions, currency)
        }
    }
}

export const parseRecommended = (recommendedResponse) => {
    return {
        meta: {
            title: recommendedResponse?.metadata?.widget?.description
        },
        products: recommendedResponse?.response?.docs.map((el) => {
            return {
                id: el.pid,
                price: el.price,
                productId: el.pid,
                imageUrl: el.thumb_image,
                image: {
                    disBaseLink: el.thumb_image
                }
            }
        })
    }
}

export const navigateRedirect = (navigateFunc, redirectURL) => {
    if (redirectURL.startsWith('/')) {
        navigateFunc(redirectURL)
    } else {
        window.location = redirectURL
    }
}
