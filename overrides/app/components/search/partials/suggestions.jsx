/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
    Text,
    Button,
    Stack,
    Box,
    Image,
    Flex
} from '@salesforce/retail-react-app/app/components/shared/ui'
import {useIntl} from 'react-intl'
import {useCurrency} from '@salesforce/retail-react-app/app/hooks'
import {useBloomreachAnalytics} from '@bloomreach/hooks/analytics'
import {PRODUCT_SUGGEST_IMAGE_WIDTH} from '@bloomreach/constants'
import {capitalizeEachWord} from '@bloomreach/utils'

function stripBTags(label) {
    return label.replace(/<\/?b>/g, '')
}

const Suggestions = ({suggestions, closeAndNavigate, searchQuery, suggestionType}) => {
    const {log} = useBloomreachAnalytics()
    const {currency: activeCurrency} = useCurrency()
    const intl = useIntl()

    const isProductSuggestion = suggestionType === 'productSuggestions'

    if (!suggestions) {
        return null
    }

    const logAndNavigate = (suggestion) => {
        const {link, type, name} = suggestion

        let url = link
        if (type === 'product') {
            url = `${link}?_br_psugg_q=${searchQuery}`
        }

        log({
            eventGroup: 'suggest',
            eventType: 'click',
            eventData: {
                aq: searchQuery,
                q: stripBTags(name)
            }
        })

        closeAndNavigate(url)
    }
    return (
        <Stack spacing={0} data-testid="sf-suggestion">
            <Box mx={'-16px'}>
                {suggestions.map((suggestion, idx) => {
                    return (
                        <Button
                            width="full"
                            onMouseDown={() => logAndNavigate(suggestion)}
                            fontSize={'md'}
                            key={idx}
                            variant="menu-link"
                            height="auto"
                            minHeight="40px"
                            marginTop={0}
                            py={isProductSuggestion ? '10px' : '0'}
                        >
                            <Flex width="full" wrap="wrap" p={0}>
                                {suggestion?.image && (
                                    <Box display="block">
                                        <Image
                                            display="block"
                                            src={suggestion.image}
                                            alt={suggestion.name}
                                            width={`${PRODUCT_SUGGEST_IMAGE_WIDTH}px`}
                                            height="auto"
                                        />
                                    </Box>
                                )}
                                <Box
                                    width={`calc(100% - ${PRODUCT_SUGGEST_IMAGE_WIDTH}px)`}
                                    textAlign="left"
                                    p={isProductSuggestion ? '5px 10px' : '0'}
                                >
                                    <Text
                                        isTruncated
                                        fontWeight="400"
                                        dangerouslySetInnerHTML={{
                                            __html: capitalizeEachWord(suggestion.name)
                                        }}
                                    />

                                    {suggestion?.price && (
                                        <Box mt="3px">
                                            <Text
                                                fontSize={'sm'}
                                                fontWeight="300"
                                                color="gray.700"
                                                dangerouslySetInnerHTML={{
                                                    __html: intl?.formatNumber(suggestion.price, {
                                                        style: 'currency',
                                                        currency: activeCurrency
                                                    })
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Flex>
                        </Button>
                    )
                })}
            </Box>
        </Stack>
    )
}

Suggestions.propTypes = {
    suggestions: PropTypes.array,
    closeAndNavigate: PropTypes.func,
    searchQuery: PropTypes.string,
    suggestionType: PropTypes.string
}

export default Suggestions
