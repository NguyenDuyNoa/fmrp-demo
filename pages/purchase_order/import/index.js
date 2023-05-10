import React, {useRef, useState} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';



const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    

    
    return (
        <React.Fragment>
            <Head>
                <title>{"Nhập hàng"} </title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
            <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
            <h6 className="text-[#141522]/40">{"Nhập hàng"}</h6>
            <span className="text-[#141522]/40">/</span>
            <h6>{"Danh sách nhập hàng"}</h6>
            </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{"Danh sách nhập hàng"}</h2>
                    <div className="flex justify-end items-center">
                     <Link href="/purchase_order/import/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>{dataLang?.purchase_order_new || "purchase_order_new"}</Link>
                  </div>
                </div>
                
                <div  className="flex space-x-3 items-center  h-[6vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                     {/* {listDs &&   listDs.map((e)=>{
                          return (
                            <div>
                            <TabClient 
                              style={{
                                backgroundColor: "#e2f0fe"
                              }} dataLang={dataLang}
                              key={e.id} 
                              onClick={_HandleSelectTab.bind(this, `${e.id}`)} 
                              total={e.count} 
                              active={e.id} 
                              className={"text-[#0F4F9E] "}
                            >{dataLang[e?.name]}</TabClient> 
                          </div>
                          )
                      })
                     } */}
                </div>
              <div className="space-y-2 2xl:h-[91%] h-[92%] overflow-hidden">    
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                        <div className='flex space-x-5'>
                        <div className='w-[12vw]'>
                            {/* <form className="flex items-center relative ">
                                <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                <input
                                    className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10  py-1.5 rounded-md "
                                    type="text" 
                                    onChange={_HandleOnChangeKeySearch.bind(this)} 
                                    placeholder={dataLang?.branch_search}
                                />
                            </form> */}
                        </div>
                        {/* <div className='ml-1 w-[12vw]'>
                            <Select 
                                 options={[{ value: '', label: dataLang?.purchase_order_branch || "purchase_order_branch", isDisabled: true }, ...listBr_filter]}
                                 onChange={onchang_filter.bind(this, "branch")}
                                 value={idBranch}
                                 placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"} 
                                hideSelectedOptions={false}
                                isClearable={true}
                                className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
                                isSearchable={true}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                // components={{ MultiValue }}
                                closeMenuOnSelect={true}
                                style={{ border: "none", boxShadow: "none", outline: "none" }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#EBF5FF',
                                        primary50: '#92BFF7',
                                        primary: '#0F4F9E',
                                    },
                                })}
                                styles={{
                                  placeholder: (base) => ({
                                  ...base,
                                  color: "#cbd5e1",
                                  }),
                                  control: (base,state) => ({
                                    ...base,
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                   ...(state.isFocused && {
                                    boxShadow: '0 0 0 1.5px #0F4F9E',
                                  }),
                                 })
                              }}
                              />
                        </div> */}
                        </div>
                        <div className="flex space-x-2 items-center">
                        {/* {
                        dataExcel?.length > 0 &&(
                            <ExcelFile filename="Danh sách đơn đặt hàng (PO)" title="DSDDH" element={
                            <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                <IconExcel size={18} /><span>{dataLang?.client_list_exportexcel}</span></button>}>
                            <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
                        </ExcelFile>
                        )
                        }
                        <label className="font-[300] text-slate-400">{dataLang?.display}</label>
                            <select className="outline-none" onChange={(e) => sLimit(e.target.value)} value={limit}>
                                <option disabled className="hidden">{limit == -1 ? "Tất cả": limit}</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={40}>40</option>
                                <option value={60}>60</option>
                            </select> */}
                        </div>
                    </div>
                </div>
                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10">
                                {/* <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_dayvoucers || "purchase_order_table_dayvoucers"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_code || "purchase_order_table_code"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_number || "purchase_order_table_number"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_totalTax || "purchase_order_table_totalTax"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_intoMoney || "purchase_order_table_intoMoney"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_statusOfSpending || "purchase_order_table_statusOfSpending"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_importStatus || "purchase_order_table_importStatus"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300]'>{dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_operations || "purchase_order_table_operations"}</h4> */}
                    </div>
                    {/* {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">                       
                          {(data?.map((e) => 
                                <div className='grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 ' key={e.id.toString()}>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-center'>{e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-center text-[#0F4F9E] hover:font-normal cursor-pointer'><Popup_chitiet dataLang={dataLang} className="text-left" name={e?.code} id={e?.id}/></h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-left'>{e.supplier_name}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center'>{e?.order_type  == "0" ? (<span className='font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200'>Tạo mới</span>) : (<span className='font-normal text-lime-500  rounded-xl py-1 px-3  bg-lime-200'>YCMH</span>)}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-left flex gap-2 flex-wrap'>{e?.purchases?.map(e => {return (<span>{e.code}</span>)})}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-right'>{formatNumber(e.total_price)}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-right'>{formatNumber(e.total_tax_price)}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-right'>{formatNumber(e.total_amount)}</h6>

                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center '>
                                    {e?.status_pay === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{dataLang?.purchase_order_table_havent_spent_yet || "purchase_order_table_havent_spent_yet"}</span>||
                                     e?.status_pay === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{dataLang?.purchase_order_table_spend_one_part || "purchase_order_table_spend_one_part"}</span> ||
                                     e?.status_pay === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{dataLang?.purchase_order_table_enough_spent || "purchase_order_table_enough_spent"}</span>
                                    }
                                </h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center '>
                                    {e?.import_status  === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{dataLang?.purchase_order_table_not_yet_entered || "purchase_order_table_not_yet_entered"}</span>||
                                     e?.import_status  === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{dataLang?.purchase_order_table_enter_one_part || "purchase_order_table_enter_one_part"}</span> ||
                                     e?.import_status  === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{dataLang?.purchase_order_table_enter_enough || "purchase_order_table_enter_enough"}</span>
                                    }
                                </h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1'><span className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">{e?.branch_name}</span></h6> 
                                <div className='col-span-1 flex justify-center'>
                                    <BtnTacVu onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} status={e?.status} id={e?.id}className="bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded xl:text-base text-xs" />
                                </div>
                                </div>
       
                          ))}              
                        </div>                     
                        </>
                      )  : 
                      (
                        <div className=" max-w-[352px] mt-24 mx-auto" >
                          <div className="text-center">
                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">{dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}</h1>
                            <div className="flex items-center justify-around mt-6 ">
                            </div>
                          </div>
                        </div>
                      )}     */}
                  </div>
                </div>
              </div>     
            </div>
            {/* <div className='grid grid-cols-12 bg-gray-100 items-center'>
                    <div className='col-span-5 p-2 text-center'>
                        <h3 className='uppercase font-normal'>{dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}</h3>
                    </div>  
                    <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap'>
                        <h3 className='font-normal'>{formatNumber(total?.total_price)}</h3>
                    </div>  
                    <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap '>
                        <h3 className='font-normal'>{formatNumber(total?.total_tax_price)}</h3>
                    </div>  
                    <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap'>
                        <h3 className='font-normal'>{formatNumber(total?.total_amount)}</h3>
                    </div>  
            </div> */}
            {/* {data?.length != 0 &&
              <div className='flex space-x-5 items-center'>
                <h6>{dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.among} {totalItems?.iTotalRecords} {dataLang?.ingredient}</h6>
                <Pagination 
                  postsPerPage={limit}
                  totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                  paginate={paginate}
                  currentPage={router.query?.page || 1}
                />
              </div>                   
            }  */}
          </div>
        </div>
      </div>
        </React.Fragment>
    );
}





export default Index;