import React from "react";
import { Container } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import Navbar from "@/containers/report-statistical/components/navbar";
import TitleHeader from "@/containers/report-statistical/components/titleHeader";

const ReportLayout = ({
    title,
    filterSection,
    tableSection,
    totalSection,
    paginationSection,
    statusExprired,
    breadcrumbItems,
}) => {
    return (
        <Container className={"!pb-0"}>
            {statusExprired ? <EmptyExprired /> : null}
            <div className="h-full">
                <div className="flex flex-col gap-5">
                    <TitleHeader title={title} breadcrumbItems={breadcrumbItems} />
                    <div className="flex gap-5">
                        <Navbar />
                        <div className="w-[calc(80%-20px)]">
                            {/* Filter Section */}
                            {filterSection}

                            {/* Table Section */}
                            <div className="3xl:h-[620px] 2xl:max-h-[550px] h-[550px] overflow-auto scrollbar-thin">
                                {tableSection}
                            </div>

                            {/* Total Section */}
                            {totalSection}

                            {/* Pagination Section */}
                            {paginationSection}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ReportLayout;