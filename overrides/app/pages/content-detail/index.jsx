import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import {Box, Heading, Text, Link} from '@salesforce/retail-react-app/app/components/shared/ui'
import {useBloomreachAnalytics} from '@bloomreach/hooks/analytics'
import {CATALOG_NAME} from '@bloomreach/constants'

const ContentDetail = (props) => {
    const contentId = props?.match?.params?.contentId
    const {track} = useBloomreachAnalytics()

    useEffect(() => {
        track({
            ptype: 'content',
            title: contentId,
            item_id: contentId,
            item_name: contentId,
            catalogs: [{name: CATALOG_NAME}]
        })
    }, [])
    return (
        <Box
            className="sf-content-detail-page"
            layerStyle="page"
            data-testid="content-details-page"
        >
            <Helmet>
                <title>{contentId}</title>
                <meta
                    name="description"
                    content={`Description of page with content id of ${contentId}`}
                />
            </Helmet>

            <Box>
                <Heading
                    marginBottom="20px"
                    size="lg"
                >{`Content with id of "${contentId}"`}</Heading>

                <Text>
                    You will need to integrate your content pages following the guidelines described{' '}
                    <Link
                        href="https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/template-extensibility.html"
                        target="_blank"
                        color="blue.500"
                    >
                        here
                    </Link>
                </Text>
            </Box>
        </Box>
    )
}

ContentDetail.getTemplateName = () => 'content-detail'

ContentDetail.propTypes = {
    /**
     * The current react router match object. (Provided internally)
     */
    match: PropTypes.object
}

export default ContentDetail
