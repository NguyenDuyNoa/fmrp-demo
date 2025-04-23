import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { StateContext } from "@/context/_state/productions-orders/StateContext";
import { useSocketContext } from "@/context/socket/SocketContext";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import useToast from "@/hooks/useToast";

export const useDeleteComment = () => {
  const { queryStateProvider, isStateProvider } = useContext(StateContext);
  const { socket } = useSocketContext();
  const showToast = useToast();

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await apiProductionsOrders.apiDeleteComment(commentId);
      return res;
    },
    onSuccess: (data) => {
      if (data && data?.isSuccess) {
        queryStateProvider((prev) => ({
          productionsOrders: {
            ...prev.productionsOrders,
            selectedImages: [],
            uploadProgress: {},
            inputCommentText: "",
            taggedUsers: [],
          },
        }));

        // 👇 Reset nội dung trong contentEditable
        if (typeof document !== "undefined") {
          const contentBox = document.querySelector('[contenteditable="true"]');
          if (contentBox) contentBox.innerHTML = "";
        }

        // Emit socket event để thông báo xóa bình luận
        if (socket && isStateProvider?.productionsOrders?.poiId) {
          const topic = `comment_pod_${isStateProvider.productionsOrders.poiId}`;
          socket.emit(topic, { data: "1" });
        }

        showToast("success", "Đã xóa bình luận!");
        return;
      } else {
        // Hiển thị thông báo lỗi từ server nếu có
        showToast("error", data?.message || "Không thể xóa bình luận!");
      }
    },
    onError: (error) => {
      console.error("Lỗi khi xóa bình luận:", error);
      showToast("error", error);
      throw error;
    },
  });

  const deleteComment = async (commentId) => {
    try {
      if (!commentId) {
        throw new Error("ID bình luận không hợp lệ");
      }
      
      deleteCommentMutation.mutate(commentId);
    } catch (error) {
      showToast("error", error?.message || "Có lỗi xảy ra khi xóa bình luận!");
      throw error;
    }
  };

  return { deleteComment, isLoading: deleteCommentMutation.isPending };
};
