import Image from 'next/image'

const NotFoundData = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center select-none'>
      <Image
        src={'/data-not-found.png'}
        alt=""
        width={400}
        height={400}
        //quality={100}
        className="3xl:w-[245px] 3xl:h-[150px] 2xl:w-[100px] xl:w-[90px] w-[90px] h-auto object-contain"
        loading="lazy"
        crossOrigin="anonymous"
      ></Image>
      <p className='text-sm font-normal mt-2'>Chưa có mặt hàng. Bắt đầu thêm mặt hàng tại khung tìm kiếm ngay!</p>
    </div>
  )
}

export default NotFoundData
