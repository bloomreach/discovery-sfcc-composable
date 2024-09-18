import React, {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useIntl} from 'react-intl'
import {Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import ProductScroller from '@bloomreach/components/WidgetProductScroller/partials/product-scroller'
import {useCurrentCustomer} from '@salesforce/retail-react-app/app/hooks/use-current-customer'
import useIntersectionObserver from '@salesforce/retail-react-app/app/hooks/use-intersection-observer'
import {useWishList} from '@salesforce/retail-react-app/app/hooks/use-wish-list'

import {useToast} from '@salesforce/retail-react-app/app/hooks/use-toast'
import useNavigation from '@salesforce/retail-react-app/app/hooks/use-navigation'
import {
    DEFAULT_LIMIT_VALUES,
    API_ERROR_MESSAGE,
    TOAST_ACTION_VIEW_WISHLIST,
    TOAST_MESSAGE_ADDED_TO_WISHLIST,
    TOAST_MESSAGE_REMOVED_FROM_WISHLIST
} from '@salesforce/retail-react-app/app/constants'
import {useShopperCustomersMutation} from '@salesforce/commerce-sdk-react'

import {useGetWidgetData} from '@bloomreach/data-access/client/queries/widget'
import {useBloomreachAnalytics} from '@bloomreach/hooks/analytics'
import {usePrevious} from '@salesforce/retail-react-app/app/hooks/use-previous'

const WidgetProductScroller = ({title, productId, widgetSettings, ...props}) => {
    const {log} = useBloomreachAnalytics()

    const queryParams = {
        rows: DEFAULT_LIMIT_VALUES[0],
        start: 0,
        fields: 'pid,title,price,thumb_image',
        item_ids: productId
    }

    const {
        isLoading,
        data: recommendData,
        isRefetching
    } = useGetWidgetData({params: queryParams, widgetSettings})

    const {data: customer} = useCurrentCustomer()
    const {customerId} = customer
    const {data: wishlist} = useWishList()

    const createCustomerProductListItem = useShopperCustomersMutation(
        'createCustomerProductListItem'
    )
    const deleteCustomerProductListItem = useShopperCustomersMutation(
        'deleteCustomerProductListItem'
    )
    const toast = useToast()
    const navigate = useNavigation()
    const {formatMessage} = useIntl()

    const ref = useRef()
    const isOnScreen = useIntersectionObserver(ref, {useOnce: true})
    const prevOnScreen = usePrevious(isOnScreen)

    useEffect(() => {
        if (isOnScreen && recommendData?.products && !prevOnScreen) {
            log({
                eventGroup: 'widget',
                eventType: 'widget-view',
                eventData: {...recommendData.analytics}
            })
        }
    }, [isOnScreen, recommendData?.products, isRefetching])

    if (!recommendData?.products?.length) {
        return null
    }

    const addItemToWishlist = async (product) => {
        try {
            if (!wishlist || !customerId) {
                return
            }
            await createCustomerProductListItem.mutateAsync({
                parameters: {
                    listId: wishlist.id,
                    customerId
                },
                body: {
                    quantity: 1,
                    productId: product.productId,
                    public: false,
                    priority: 1,
                    type: 'product'
                }
            })

            toast({
                title: formatMessage(TOAST_MESSAGE_ADDED_TO_WISHLIST, {quantity: 1}),
                status: 'success',
                action: (
                    <Button variant="link" onClick={() => navigate('/account/wishlist')}>
                        {formatMessage(TOAST_ACTION_VIEW_WISHLIST)}
                    </Button>
                )
            })
        } catch {
            toast({
                title: formatMessage(API_ERROR_MESSAGE),
                status: 'error'
            })
        }
    }

    const removeItemFromWishlist = async (product) => {
        try {
            const wishlistItem = wishlist?.customerProductListItems?.find(
                (item) => item.productId === product.productId
            )
            if (!wishlistItem || !wishlist || !customerId) {
                return
            }
            await deleteCustomerProductListItem.mutateAsync({
                parameters: {
                    customerId,
                    itemId: wishlistItem.id,
                    listId: wishlist.id
                }
            })
            toast({
                title: formatMessage(TOAST_MESSAGE_REMOVED_FROM_WISHLIST),
                status: 'success',
                id: product.productId
            })
        } catch {
            toast({
                title: formatMessage(API_ERROR_MESSAGE),
                status: 'error'
            })
        }
    }

    return (
        <ProductScroller
            ref={ref}
            title={title || recommendData?.meta?.title}
            products={recommendData?.products}
            isLoading={isLoading}
            productTileProps={(product) => ({
                enableFavourite: true,
                isFavourite: wishlist?.customerProductListItems?.some(
                    (item) => item.productId === product?.productId
                ),
                onFavouriteToggle: (isFavourite) => {
                    const action = isFavourite ? removeItemFromWishlist : addItemToWishlist
                    return action(product)
                }
            })}
            analytics={recommendData?.analytics}
            {...props}
        />
    )
}

WidgetProductScroller.propTypes = {
    title: PropTypes.any,
    productId: PropTypes.string,
    widgetSettings: PropTypes.object
}

export default WidgetProductScroller
