import { useCallback } from 'react';

const useDragAndDrop = (data, updateData, keyTask) => {
    const onDragEnd = useCallback((result) => {
        const { source, destination } = result;

        if (!destination) {
            return; // Không có điểm đích
        }

        const updatedData = [...data];

        // Hàm hỗ trợ để lấy mảng dựa vào keyTask
        const getArrayByKeyTask = (index) => {
            if (keyTask && updatedData[index]?.hasOwnProperty(keyTask) && Array.isArray(updatedData[index][keyTask])) {
                return updatedData[index][keyTask];
            }
            return null; // Trường hợp không tìm thấy hoặc không phải mảng
        };

        if (source.droppableId === destination.droppableId) {
            // Kéo và thả trong cùng một danh sách
            const listIndex = +source.droppableId.split('-')[1];
            const items = getArrayByKeyTask(listIndex);

            if (items) {
                const [reorderedItem] = items.splice(result.source.index, 1);
                items.splice(result.destination.index, 0, reorderedItem);
                updatedData[listIndex][keyTask] = items;
            } else {
                // Xử lý mặc định nếu không tìm thấy mảng theo keyTask
                const [reorderedItem] = updatedData.splice(result.source.index, 1);
                updatedData.splice(result.destination.index, 0, reorderedItem);
            }
        } else {
            // Kéo và thả giữa các danh sách khác nhau
            const sourceListIndex = +source.droppableId.split('-')[1];
            const destListIndex = +destination.droppableId.split('-')[1];
            const sourceItems = getArrayByKeyTask(sourceListIndex);
            const destItems = getArrayByKeyTask(destListIndex);

            if (sourceItems && destItems) {
                const [removed] = sourceItems.splice(source.index, 1);
                destItems.splice(destination.index, 0, removed);

                updatedData[sourceListIndex][keyTask] = sourceItems;
                updatedData[destListIndex][keyTask] = destItems;
            } else {
                // Xử lý mặc định nếu không tìm thấy mảng theo keyTask
                const [reorderedItem] = updatedData.splice(result.source.index, 1);
                updatedData.splice(result.destination.index, 0, reorderedItem);
            }
        }
        // Cập nhật lại state
        updateData(updatedData);
    }, [data, updateData, keyTask]);

    return { onDragEnd }
};

export default useDragAndDrop;



// import { useCallback } from 'react';

// const useDragAndDrop = (data, updateData) => {
//     const onDragEnd = useCallback((result) => {
//         const { source, destination } = result;

//         if (!destination) {
//             return; // Không có điểm đích
//         }

//         const updatedData = [...data];

//         if (source.droppableId === destination.droppableId) {
//             // Kéo và thả trong cùng một danh sách
//             const listIndex = +source.droppableId.split('-')[1];
//             const items = [...updatedData[listIndex].tasks];
//             const [removed] = items.splice(source.index, 1);
//             items.splice(destination.index, 0, removed);
//             updatedData[listIndex].tasks = items;
//         } else {
//             // Kéo và thả giữa các danh sách khác nhau
//             const sourceListIndex = +source.droppableId.split('-')[1];
//             const destListIndex = +destination.droppableId.split('-')[1];
//             const sourceItems = [...updatedData[sourceListIndex].tasks];
//             const destItems = [...updatedData[destListIndex].tasks];
//             const [removed] = sourceItems.splice(source.index, 1);
//             destItems.splice(destination.index, 0, removed);

//             updatedData[sourceListIndex].tasks = sourceItems;
//             updatedData[destListIndex].tasks = destItems;
//         }

//         // Cập nhật lại state
//         updateData(updatedData);
//     }, [data, updateData]);

//     return {
//         onDragEnd
//     };
// };

// export default useDragAndDrop;
