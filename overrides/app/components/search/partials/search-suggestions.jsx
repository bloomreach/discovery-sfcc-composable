import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import {Stack, Heading, Box, Divider} from '@salesforce/retail-react-app/app/components/shared/ui'
import RecentSearches from '@salesforce/retail-react-app/app/components/search/partials/recent-searches'
import Suggestions from '@salesforce/retail-react-app/app/components/search/partials/suggestions'
import {SUGGESTION_TYPE_KEYS} from '@bloomreach/constants'

const SearchSuggestions = ({recentSearches, searchSuggestions, closeAndNavigate}) => {
    const hasCategorySuggestions = searchSuggestions?.categorySuggestions?.length
    const hasPhraseSuggestions = searchSuggestions?.phraseSuggestions?.length
    const hasProductSuggestions = searchSuggestions?.productSuggestions?.length
    const hasSuggestions = hasCategorySuggestions || hasPhraseSuggestions || hasProductSuggestions

    return (
        <Stack spacing={0}>
            {hasSuggestions ? (
                <Fragment>
                    {SUGGESTION_TYPE_KEYS?.map((suggestEntry, index) => {
                        return (
                            <Box key={index}>
                                <Box paddingX={6} paddingY={3}>
                                    <Heading
                                        as="h6"
                                        size="sm"
                                        color="gray"
                                        mb="6px"
                                        fontWeight="normal"
                                    >
                                        {suggestEntry.title}
                                    </Heading>

                                    <Suggestions
                                        closeAndNavigate={closeAndNavigate}
                                        suggestions={searchSuggestions?.[suggestEntry.key]}
                                    />
                                </Box>

                                {index < SUGGESTION_TYPE_KEYS.length - 1 && <Divider />}
                            </Box>
                        )
                    })}
                </Fragment>
            ) : (
                <Box paddingX={6} paddingY={3}>
                    <RecentSearches
                        recentSearches={recentSearches}
                        closeAndNavigate={closeAndNavigate}
                    />
                </Box>
            )}
        </Stack>
    )
}

SearchSuggestions.propTypes = {
    recentSearches: PropTypes.array,
    searchSuggestions: PropTypes.object,
    closeAndNavigate: PropTypes.func
}

export default SearchSuggestions
