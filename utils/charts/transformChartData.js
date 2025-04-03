// utils/transformChartData.ts
export function transformChartData(data) {
    const chartData = [];

    data?.forEach((item) => {
        const name = item?.item_name;

        chartData.push(
            { name, type: 'Đổ xuất', value: parseFloat(item.quantity_exported || 0) },
            { name, type: 'Còn lại', value: parseFloat(item.quantity_rest || 0) },
            { name, type: 'Thu hồi', value: parseFloat(item.quantity_recovery || 0) },
            { name, type: 'Kế hoạch', value: parseFloat(item.quantity_total_quota || 0) }
        );
    });

    return chartData;
}
