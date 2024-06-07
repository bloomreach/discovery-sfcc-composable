/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Link as ChakraLink} from '@salesforce/retail-react-app/app/components/shared/ui'
import {Link as SPALink, NavLink as NavSPALink, useLocation} from 'react-router-dom'
import useMultiSite from '@salesforce/retail-react-app/app/hooks/use-multi-site'

const Link = React.forwardRef(({href, to, useNavLink = false, ...props}, ref) => {
    const {pathname, search, hash} = useLocation()

    const _href = to || href
    const {buildUrl} = useMultiSite()
    const updatedHref = buildUrl(_href)

    // Update the Link component to store the referring URL before navigating
    const locationObj = {
        pathname: updatedHref,
        state: {
            referrer: {pathname, search, hash}
        }
    }
    return (
        <ChakraLink
            as={useNavLink ? NavSPALink : SPALink}
            {...(useNavLink && {exact: true})}
            {...props}
            to={locationObj}
            ref={ref}
        />
    )
})

Link.displayName = 'Link'

Link.propTypes = {href: PropTypes.string, to: PropTypes.string, useNavLink: PropTypes.bool}

export default React.memo(Link)
