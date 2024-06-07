import React from 'react'
import PropTypes from 'prop-types'
import {Box, Heading, Link, Text, Flex} from '@salesforce/retail-react-app/app/components/shared/ui'
import PageHeader from '../../../overrides/app/pages/product-list/partials/page-header'
import Pagination from '@salesforce/retail-react-app/app/components/pagination'

const ContentList = ({headerSettings, results, paginationSettings}) => {
    const {
        searchQuery,
        searchMeta: {didYouMean, total},
        isLoading
    } = headerSettings

    const {currentURL, urls} = paginationSettings
    return (
        <Box>
            <Flex align="left" width="287px">
                <PageHeader
                    searchQuery={searchQuery}
                    productSearchResult={{
                        didYouMean,
                        total
                    }}
                    isLoading={isLoading}
                />
            </Flex>

            {results?.map((result) => {
                const {item_id, title, description} = result
                return (
                    <Box
                        key={item_id}
                        marginBottom="16px"
                        borderRadius="2px"
                        border="1px"
                        borderColor="gray.200"
                    >
                        <Heading as="h4" fontSize="22px" padding="20px" py="12px">
                            <Link href={`/content/${item_id}`} color="blue.500" fontWeight="normal">
                                {title}
                            </Link>
                        </Heading>

                        {description && (
                            <Text padding="20px" py="12px" borderTop="1px" borderColor="gray.200">
                                {description}
                            </Text>
                        )}
                    </Box>
                )
            })}

            <Flex justifyContent={['center']} paddingTop={8}>
                <Pagination currentURL={currentURL} urls={urls} />
            </Flex>
        </Box>
    )
}

ContentList.propTypes = {
    headerSettings: PropTypes.object,
    results: PropTypes.any,
    paginationSettings: PropTypes.object
}

export default ContentList
