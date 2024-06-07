/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {useCallback} from 'react'
import {useHistory, useLocation} from 'react-router'
import useMultiSite from '@salesforce/retail-react-app/app/hooks/use-multi-site'
import {removeSiteLocaleFromPath} from '@salesforce/retail-react-app/app/utils/url'

/**
 * A convenience hook for programmatic navigation uses history's `push` or `replace`. The proper locale
 * is automatically prepended to the provided path. Additional args are passed through to `history`.
 *
 * Updated to store the current path for referrer, important for Bloomreach tracking
 *
 * @returns {function} - Returns a navigate function that passes args to history methods.
 */
const useNavigation = () => {
    const history = useHistory()
    const location = useLocation()

    const {site, locale: localeShortCode, buildUrl} = useMultiSite()

    return useCallback(
        /**
         *
         * @param {string} path - path to navigate to
         * @param {('push'|'replace')} action - which history method to use
         * @param  {...any} args - additional args passed to `.push` or `.replace`
         */
        (path, action = 'push', ...args) => {
            // This is a little overkill, since nothing in the PWAKit project today
            // sends anything other than an empty {} for the 3rd arg, and even then only in a test
            // But just to be safe
            const [state = {}, ...args2] = args
            if (typeof state === 'object' && !Array.isArray(state)) {
                const {pathname, search, hash} = location
                state.referrer = {pathname, search, hash}
            }

            const updatedHref = buildUrl(removeSiteLocaleFromPath(path))
            history[action](path === '/' ? '/' : updatedHref, state, ...args2)
        },
        [localeShortCode, site]
    )
}

export default useNavigation
