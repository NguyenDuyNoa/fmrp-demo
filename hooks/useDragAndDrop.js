import { useCallback } from 'react';

const useDragAndDrop = (data, updateData) => {
    const onDragEnd = useCallback((result) => {
        const { source, destination } = result;

        if (!destination) {
            return; // Không có điểm đích
        }

        const updatedData = [...data];

        if (source.droppableId === destination.droppableId) {
            // Kéo và thả trong cùng một danh sách
            const listIndex = +source.droppableId.split('-')[1];
            const items = [...updatedData[listIndex].tasks];
            const [removed] = items.splice(source.index, 1);
            items.splice(destination.index, 0, removed);
            updatedData[listIndex].tasks = items;
        } else {
            // Kéo và thả giữa các danh sách khác nhau
            const sourceListIndex = +source.droppableId.split('-')[1];
            const destListIndex = +destination.droppableId.split('-')[1];
            const sourceItems = [...updatedData[sourceListIndex].tasks];
            const destItems = [...updatedData[destListIndex].tasks];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            updatedData[sourceListIndex].tasks = sourceItems;
            updatedData[destListIndex].tasks = destItems;
        }

        // Cập nhật lại state
        updateData(updatedData);
    }, [data, updateData]);

    return {
        onDragEnd
    };
};

export default useDragAndDrop;
