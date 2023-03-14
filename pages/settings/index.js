import React, {useEffect} from 'react';
import {useRouter} from'next/router';

const Index = React.memo(() => {
    const router = useRouter();
    
    useEffect(() => {
      router.replace('/settings/information');
    }, [])
    
    return null
})

export default Index