import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import {useIntl} from 'react-intl'
import {Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import ProductScroller from '@salesforce/retail-react-app/app/components/product-scroller'
import {useCurrentCustomer} from '@salesforce/retail-react-app/app/hooks/use-current-customer'
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

import {useGetRecommended} from '@bloomreach/data-access/client/queries/recommend'

const Recommended = ({title, productId, ...props}) => {
    const queryParams = {
        rows: DEFAULT_LIMIT_VALUES[0],
        start: 0,
        fields: 'pid,price,thumb_image',
        item_ids: productId
    }
    const {isLoading, data: recommendData} = useGetRecommended(queryParams)

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
            {...props}
        />
    )
}

Recommended.propTypes = {
    title: PropTypes.any,
    productId: PropTypes.string
}

export default Recommended
