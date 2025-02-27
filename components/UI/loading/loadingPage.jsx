import Head from 'next/head';
import React from 'react'

const LoadingPage = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Đang kiểm tra dữ liệu</title>
            </Head>
            <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 relative bg-[#fdfdfe]">
                {/* <Image alt="" src="/logo_1.png" width={200} height={70} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
        <h1>Đang kiểm tra dữ liệu vui lòng chờ trong giây lát</h1>
        <svg className="animate-spin h-40 w-40 opacity-50 absolute z-[-1] text-blue-600 fill-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> */}
                <img src="/loading-final.gif" className="h-52" />
                {/* <img src="/loadingLogo.gif.jpg" className="h-40" /> */}
            </div>
        </React.Fragment>
    );
};

export default LoadingPage