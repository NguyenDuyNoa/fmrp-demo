import ProductionsOrders from '@/containers/manufacture/productions-orders'
import LoadingPage from '@/components/UI/loading/loadingPage'
import dynamic from 'next/dynamic'
import React from 'react'
// const ProductionsOrders = dynamic(() => import('@/containers/manufacture/productions-orders'), { ssr: false, loading: () => <LoadingPage /> })
const Index = (props) => {
    return <ProductionsOrders {...props} type='desktop' />
}

export default Index