import { forwardRef } from "react";
import { Customscrollbar } from "./Customscrollbar";

export const ContainerFilterTab = forwardRef(({ children, className }, ref) => {
  return (
    <Customscrollbar
      forceVisible="x"
      ref={ref}
      className={`${className} overflow-x-auto h-fit demo4 simplebar-scrollable-x`}
      scrollableNodePropsClassName="[&>div]:flex [&>div]:items-center [&>div]:justify-start [&>div]:space-x-3 h-fit"
      // className="flex items-center justify-start overflow-hidden overflow-y-hidden 2xl:space-x-3 lg:space-x-3 h-fit scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
    >
      {children}
    </Customscrollbar>
  );
});

export const Container = ({ children, className }) => {
  return (
    <div
      className={`${className} pt-[72px] 3xl:px-6 2xl:px-4 xl:px-4 px-4 3xl:space-y-2 space-y-1 overflow-hidden h-screen`}
    >
      {/* return <div className={`${className} 3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-8 px-4 lg:pb-8 space-y-1 overflow-hidden h-screen`}> */}
      {children}
    </div>
  );
};

export const ContainerBody = ({ children }) => {
  return (
    <div className=" gap-1 3xl:h-[95%] h-[95%] overflow-hidden col-span-7 flex-col justify-between">
      <div className="h-[100%] flex flex-col justify-between overflow-hidden">
        {/* <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden"> */}
        {children}
      </div>
    </div>
  );
};

export const ContainerTotal = ({ children, className }) => {
  return (
    <div
      className={`${
        className ? className : ""
      } grid grid-cols-12 bg-gray-100 items-center`}
    >
      {children}
    </div>
  );
};
export const ContainerTable = ({ children }) => {
  return <div className="h-full w-full">{children}</div>;
};

export const LayOutTableDynamic = ({
  head,
  breadcrumb,
  titleButton,
  fillterTab,
  table,
  pagination,
  showTotal = false,
  total,
}) => {
  return (
    <>
      {head}
      <Container>
        {breadcrumb}
        <ContainerBody>
          <div className="space-y-0.5 overflow-hidden flex flex-col h-full">
            <div className="flex justify-between mt-1 mr-2">{titleButton}</div>
            {fillterTab && (
              <div className="w-full h-fit">
                <ContainerFilterTab>{fillterTab}</ContainerFilterTab>
              </div>
            )}
            <div className="flex-1 min-h-0 flex flex-col  overflow-hidden">
              <ContainerTable className="flex-1 min-h-0 overflow-hidden">
                {table}
              </ContainerTable>
            </div>
            {showTotal && total}
            <div className="w-full h-fit ">{pagination}</div>
          </div>
        </ContainerBody>
      </Container>
    </>
  );
};
