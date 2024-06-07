/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import loadable from '@loadable/component'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

// Components
import {Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'
import {configureRoutes} from '@salesforce/retail-react-app/app/utils/routes-utils'
import {routes as _routes} from '@salesforce/retail-react-app/app/routes'
const fallback = <Skeleton height="75vh" width="100%" />

// Create your pages here and add them to the routes array
// Use loadable to split code into smaller js chunks
const Home = loadable(() => import('./pages/home'), {fallback})

const ProductList = loadable(() => import('./pages/product-list'))
const ProductDetail = loadable(() => import('./pages/product-detail'))
const ContentDetail = loadable(() => import('./pages/content-detail'))

const CheckoutConfirmation = loadable(() => import('./pages/checkout/confirmation'))

const routes = [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/search',
        component: ProductList
    },
    {
        path: '/product/:productId',
        component: ProductDetail
    },
    {
        path: '/category/:categoryId',
        component: ProductList
    },
    {
        path: '/content/:contentId',
        component: ContentDetail
    },
    {
        path: '/checkout/confirmation/:orderNo',
        component: CheckoutConfirmation
    },
    ..._routes
]

export default () => {
    const config = getConfig()
    return configureRoutes(routes, config, {
        ignoredRoutes: ['/callback', '*']
    })
}
