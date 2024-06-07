/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import PropTypes from 'prop-types'
// Components
import {Box, Heading, Flex, Text, Fade} from '@salesforce/retail-react-app/app/components/shared/ui'

// Project Components
import Breadcrumb from '@salesforce/retail-react-app/app/components/breadcrumb'
import {useLocation} from 'react-router-dom'
import Link from '@salesforce/retail-react-app/app/components/link'

const PageHeader = ({category, productSearchResult, isLoading, searchQuery, ...otherProps}) => {
    const location = useLocation()
    const autoCorrectQuery = productSearchResult?.autoCorrectQuery
    const didYouMean = productSearchResult?.didYouMean

    return (
        <Box {...otherProps} data-testid="sf-product-list-breadcrumb">
            {/* Breadcrumb */}
            {category && <Breadcrumb categories={category.parentCategoryTree} />}
            {searchQuery && <Text>Search Results for</Text>}
            {/* Category Title */}
            <Flex mb={3}>
                <Heading as="h2" size="lg" marginRight={2}>
                    {`${category?.name || autoCorrectQuery || searchQuery || ''}`}
                </Heading>
                <Heading as="h2" size="lg" marginRight={2}>
                    {!isLoading && <Fade in={true}>({productSearchResult?.total})</Fade>}
                </Heading>
            </Flex>

            {autoCorrectQuery && (
                <Box>
                    <Text>Found no results for: {`"${searchQuery}"`}</Text>

                    <Text>Autocorrected to: {`"${autoCorrectQuery}"`}</Text>

                    {!!didYouMean?.length && (
                        <Text>
                            Did you mean:{' '}
                            {didYouMean
                                .map((entry, index) => {
                                    const searchParams = new URLSearchParams(location.search)
                                    searchParams.set('q', entry)

                                    const newSearchParams = searchParams.toString()
                                    const newUrl = `${location.pathname}?${newSearchParams}`

                                    return (
                                        <Link key={index} to={newUrl}>
                                            {entry}
                                        </Link>
                                    )
                                })
                                .reduce((prev, curr, index, array) => {
                                    prev.push(curr)
                                    if (index < array.length - 1) {
                                        prev.push(' ') // Add space after each link except the last one
                                    }
                                    return prev
                                }, [])}
                        </Text>
                    )}
                </Box>
            )}
        </Box>
    )
}

PageHeader.propTypes = {
    category: PropTypes.object,
    productSearchResult: PropTypes.object,
    isLoading: PropTypes.bool,
    searchQuery: PropTypes.string
}

export default PageHeader
