// "use client";
// import { useEffect, useRef } from "react";
// import { useAuthStore } from "@/stores/useAuthStores";
// import { useQueryClient } from "@tanstack/react-query";
// import io from "socket.io-client"; // Import socket.io-client
// import useCookieStore from "@/stores/useCookieStore";
// import { KEY_COOKIES } from "@/constants/Cookie";
// import { useTicketQueryKeys } from "../query-key";
// import { useStateTicket } from "@/managers/state-management/ticket/useStateTicket";

// export const useSocket = () => {
//     const queryClient = useQueryClient();

//     const { informationUser } = useAuthStore();

//     const socketRef = useRef<any>(null); // Dùng ref để giữ instance Socket.IO ổn định

//     console.log("informationUser", informationUser);
//     const { getCookie } = useCookieStore();

//     const { isStateTicket } = useStateTicket();

//     const invalidateQueries = () => {
//         const { getData } = useTicketQueryKeys();

//         const { key: getDataInfo } = getData.getDataInfo();

//         const { key: getDataTicketByGroup } = getData.getDataByGroup();

//         const { key: getDetailTicketById } = getData.getDetailTicketById();

//         queryClient.invalidateQueries({ queryKey: [...getDataInfo] });
//         queryClient.invalidateQueries({ queryKey: [...getDetailTicketById] });
//         queryClient.invalidateQueries({ queryKey: [...getDataTicketByGroup] });
//     };
//     useEffect(() => {
//         if (!informationUser?.user_id || !getCookie(KEY_COOKIES.WEBSITE_PLAY_SOCKET as string)) return;

//         // Tạo instance Socket.IO với cấu hình header
//         const socket = io(informationUser?.url_socket, {
//             extraHeaders: {
//                 auth: getCookie(KEY_COOKIES.WEBSITE_PLAY_SOCKET as string) as string,
//             },
//         });

//         socketRef.current = socket;

//         // Khi kết nối thành công
//         socket.on("connect", () => {
//             console.log("Connected to server as driver:", socket.id);
//             socket.emit("connectedData", {
//                 user_id: informationUser?.user_id,
//                 user_name: informationUser?.user_name,
//             });
//         });

//         // Nhận sự kiện chat_message
//         socket.on("add_comment", (data) => {
//             console.log("Data Chat:", data);
//             if (data?.data) {
//                 invalidateQueries();
//                 setTimeout(() => {
//                     const viewport = document.querySelector("#scroll-container [data-radix-scroll-area-viewport]");
//                     if (viewport) {
//                         viewport.scrollTop = viewport.scrollHeight + 100;
//                     }
//                 }, 2000);
//             }
//         });
//         socket.on("like_comment", (data) => {
//             console.log("Data Chat like_comment:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("remove_like_comment", (data) => {
//             console.log("Data Chat remove_like_comment:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("add_solution", (data) => {
//             console.log("Data Chat add_solution:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("like_solution", (data) => {
//             console.log("Data Chat like_solution:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("remove_like_solution", (data) => {
//             console.log("Data Chat remove_like_solution:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("add_ticket", (data) => {
//             console.log("Data Chat add_ticket:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("update_ticket", (data) => {
//             console.log("Data Chat update_ticket:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("ticket_to_group", (data) => {
//             console.log("Data Chat ticket_to_group:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("remove_ticket", (data) => {
//             console.log("Data Chat remove_ticket:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("remove_ticket_to_group", (data) => {
//             console.log("Data Chat remove_ticket_to_group:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("add_employee_ticket", (data) => {
//             console.log("Data Chat add_employee_ticket:", data);
//             if (Array.isArray(data?.data)) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("remove_employee_ticket", (data) => {
//             console.log("Data Chat remove_employee_ticket:", data);
//             if (Array.isArray(data?.data)) {
//                 invalidateQueries();
//             }
//         });
//         socket.on("success_ticket", (data) => {
//             console.log("Data Chat success_ticket:", data);
//             if (data?.data) {
//                 invalidateQueries();
//             }
//         });

//         // Xử lý lỗi kết nối
//         socket.on("connect_error", (error) => {
//             console.error("Lỗi kết nối Socket.IO:", error);
//         });

//         // Xử lý khi ngắt kết nối
//         socket.on("disconnect", () => {
//             console.log("Socket.IO đã ngắt kết nối");
//         });
//         console.log("informationUser", informationUser);

//         // Cleanup khi component unmount
//         return () => {
//             if (socketRef.current) {
//                 console.log("1111");

//                 socketRef.current.disconnect(); // Ngắt kết nối Socket.IO
//                 socketRef.current = null; // Reset ref
//             }
//         };
//     }, [informationUser, getCookie(KEY_COOKIES.WEBSITE_PLAY_SOCKET as string)]);

//     const sendMessage = (message: string, chatId: number) => {
//         // if (socketRef.current && socketRef.current.connected) {
//         //     socketRef.current.emit("chat_message", {
//         //         message,
//         //         chatId,
//         //         user_id: informationUser?.id || 58,
//         //     });
//         // } else {
//         //     console.error("Socket.IO chưa kết nối!");
//         // }
//     };

//     return { sendMessage }; // Trả về hàm gửi tin nhắn để sử dụng nếu cần
// };

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client"; // Thêm import kiểu Socket từ socket.io-client
import io from "socket.io-client";

import { KEY_COOKIES } from "@/constants/Cookie";
import useCookieStore from "@/stores/useCookieStore";
import { useAuthStore } from "@/stores/useAuthStores";
import { useStateTicket } from "@/managers/state-management/ticket/useStateTicket";
import { useStateSidebar } from "@/managers/state-management/layout/useStateSidebar";
import { useTicketQueryKeys } from "../query-key";

// Định nghĩa interface cho thông tin user
interface UserInformation {
    user_id: string;
    user_name: string;
    url_socket: string;
}

// Định nghĩa interface cho payload của socket event
interface SocketPayload {
    event: string;
    data: any;
}

// Định nghĩa kiểu cho socket instance
type SocketInstance = Socket | null;

// Biến global lưu socket instance
let socket: SocketInstance = null;

// Biến global lưu handler invalidate
let onInvalidateHandler: ((payload: SocketPayload) => void) | null = null;

export const useSocket = () => {
    const queryClient = useQueryClient();

    // Lấy state
    const { getCookie } = useCookieStore();
    const { informationUser } = useAuthStore() as { informationUser: UserInformation | undefined };
    const cookies = getCookie(KEY_COOKIES.WEBSITE);
    const { isStateTicket: ticket } = useStateTicket();
    const { isStateSidebar: sidebar } = useStateSidebar();

    // Query keys
    const { getData } = useTicketQueryKeys();
    const { key: getDataInfo } = getData.getDataInfo();
    const { key: getDataTicketByGroup } = getData.getDataByGroup();
    const { key: getDetailTicketById } = getData.getDetailTicketById();

    // Hàm invalidate theo sự kiện
    const invalidateQueries = (eventName?: string): void => {
        queryClient.invalidateQueries({ queryKey: [...getDataInfo] });
        queryClient.invalidateQueries({ queryKey: [...getDetailTicketById] });
        queryClient.invalidateQueries({ queryKey: [...getDataTicketByGroup] });

        if (eventName === "add_comment" || eventName === "add_solution") {
            setTimeout(() => {
                const viewport = document.querySelector(
                    "#scroll-container [data-radix-scroll-area-viewport]"
                ) as HTMLElement | null;
                // if (viewport) {
                //     viewport.scrollTop = viewport.scrollHeight + 100;
                // }
                const comments = document.querySelectorAll(".comment-item"); // hoặc class bạn đặt cho mỗi comment

                if (viewport && comments.length > 0) {
                    const lastComment = comments[0] as HTMLElement;
                    const offsetTop = lastComment.offsetTop;

                    viewport.scrollTo({
                        top: offsetTop - 70,
                        behavior: "smooth",
                    });
                }
                // const target = document.querySelector(".target-div");
                // if (viewport && target) {
                //     const targetTop = target.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
                //     viewport.scrollTop = targetTop;
                // }
            }, 2000);
        }
    };

    // ✅ useEffect 1: khởi tạo socket MỘT LẦN
    useEffect(() => {
        const playToken = getCookie(KEY_COOKIES.WEBSITE_PLAY_SOCKET);

        if (!informationUser?.user_id || !playToken) return;
        if (socket) return; // tránh khởi tạo lại socket

        socket = io(informationUser.url_socket, {
            extraHeaders: {
                auth: playToken,
            },
        });

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket?.id);
            socket?.emit("connectedData", {
                user_id: informationUser.user_id,
                user_name: informationUser.user_name,
            });
        });

        const events: string[] = [
            "add_ticket",
            "update_ticket",
            "ticket_to_group",
            "remove_ticket_to_group",
            "add_employee_ticket",
            "remove_employee_ticket",
            "add_comment",
            "edit_comment",
            "remove_comment",
            "like_comment",
            "remove_like_comment",
            "add_solution",
            "edit_solution",
            "remove_solution",
            "like_solution",
            "remove_like_solution",
            "success_ticket",
            "unsuccess_ticket",
            "remove_ticket",
            "edit_group",
            "add_group",
        ];

        events.forEach((eventName: string) => {
            socket?.on(eventName, (data: any) => {
                console.log(`[SOCKET] ${eventName}`, data);
                if (data?.data && typeof onInvalidateHandler === "function") {
                    onInvalidateHandler({
                        event: eventName,
                        data: data.data,
                    });
                }
            });
        });

        socket.on("disconnect", () => {
            console.log("🔌 Socket disconnected");
        });

        socket.on("connect_error", (err: Error) => {
            console.error("❌ Socket connection error:", err);
        });

        return () => {
            socket?.disconnect();
            socket = null;
            onInvalidateHandler = null;
            console.log("🧹 Socket cleaned up");
        };
    }, [informationUser?.user_id, cookies]);

    // ✅ useEffect 2: cập nhật invalidate handler theo state mới nhất
    useEffect(() => {
        onInvalidateHandler = ({ event }: SocketPayload) => {
            console.log("♻️ Invalidate from event:", event);
            invalidateQueries(event);
        };

        return () => {
            // Cleanup handler nếu component unmount
            onInvalidateHandler = null;
        };
    }, [cookies, ticket, sidebar, informationUser]);
};

// "use client";

// import { useEffect, useRef } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import io from "socket.io-client";

// import { KEY_COOKIES } from "@/constants/Cookie";
// import useCookieStore from "@/stores/useCookieStore";
// import { useAuthStore } from "@/stores/useAuthStores";
// import { useStateTicket } from "@/managers/state-management/ticket/useStateTicket";
// import { useStateSidebar } from "@/managers/state-management/layout/useStateSidebar";
// import { useTicketQueryKeys } from "../query-key";

// export const useSocket = () => {
//     const socketRef = useRef<any>(null);
//     const queryClient = useQueryClient();

//     // 🔗 Hooks để lấy state mới nhất (dùng làm deps)
//     const { getCookie } = useCookieStore();
//     const { informationUser } = useAuthStore();
//     const cookies = getCookie(KEY_COOKIES.WEBSITE);
//     const { isStateTicket: ticket } = useStateTicket();
//     const { isStateSidebar: sidebar } = useStateSidebar();

//     // ✅ useEffect 1 - Khởi tạo socket MỘT LẦN
//     useEffect(() => {
//         const playToken = getCookie(KEY_COOKIES.WEBSITE_PLAY_SOCKET);

//         if (!informationUser?.user_id || !playToken) return;
//         if (socketRef.current) return; // tránh khởi tạo lại

//         const socket = io(informationUser.url_socket, {
//             extraHeaders: {
//                 auth: playToken,
//             },
//         });

//         socketRef.current = socket;

//         socket.on("connect", () => {
//             console.log("✅ Socket connected:", socket.id);
//             socket.emit("connectedData", {
//                 user_id: informationUser.user_id,
//                 user_name: informationUser.user_name,
//             });
//         });

//         const events = [
//             "add_comment",
//             "like_comment",
//             "remove_like_comment",
//             "add_solution",
//             "like_solution",
//             "remove_like_solution",
//             "add_ticket",
//             "update_ticket",
//             "ticket_to_group",
//             "remove_ticket",
//             "remove_ticket_to_group",
//             "add_employee_ticket",
//             "remove_employee_ticket",
//             "success_ticket",
//         ];

//         socketRef.current.onInvalidate = (payload: any) => {};

//         // Lắng nghe sự kiện socket
//         events.forEach((eventName) => {
//             socket.on(eventName, (data) => {
//                 console.log(`[SOCKET] ${eventName}`, data);
//                 if (data?.data && typeof socketRef.current?.onInvalidate === "function") {
//                     socketRef.current.onInvalidate({
//                         event: eventName,
//                         data: data?.data,
//                     });
//                 }
//             });
//         });

//         socket.on("disconnect", () => {
//             console.log("🔌 Socket disconnected");
//         });

//         socket.on("connect_error", (err) => {
//             console.error("❌ Socket connection error:", err);
//         });

//         return () => {
//             socket.disconnect();
//             socketRef.current = null;
//             console.log("🧹 Socket cleaned up");
//         };
//     }, [informationUser?.user_id, getCookie(KEY_COOKIES.WEBSITE_PLAY_SOCKET)]);

//     // ✅ useEffect 2 - Cập nhật invalidateQueries khi state thay đổi

//     const { getData } = useTicketQueryKeys();

//     const { key: getDataInfo } = getData.getDataInfo();

//     const { key: getDataTicketByGroup } = getData.getDataByGroup();

//     const { key: getDetailTicketById } = getData.getDetailTicketById();
//     const invalidateQueries = () => {
//         queryClient.invalidateQueries({ queryKey: [...getDataInfo] });
//         queryClient.invalidateQueries({ queryKey: [...getDetailTicketById] });
//         queryClient.invalidateQueries({ queryKey: [...getDataTicketByGroup] });
//     };
//     useEffect(() => {
//         if (!socketRef.current) return;

//         // const key_getDetailTicketById = ["getDetailTicketById", { cookies }, ticket?.parentDetailTicket];

//         // const key_getDataInfo = ["getDataInfo", { cookies, informationUser }];

//         // const key_getDataByGroup = [
//         //     "getDataByGroup",
//         //     { cookies, informationUser },
//         //     ticket?.parentTicket,
//         //     sidebar?.allTickets,
//         //     ticket?.fillterTop?.priority,
//         //     ticket?.fillterTop?.search,
//         //     ticket?.fillterTop?.startDate,
//         //     ticket?.fillterTop?.endDate,
//         //     ticket?.fillterTop?.sort,
//         // ];

//         // // Gán hàm invalidate mới nhất vào socket
//         socketRef.current.onInvalidate = (e: any) => {
//             console.log("♻️ invalidateQueries (latest keys)", "E", e);
//             invalidateQueries();
//             if (e?.event === "add_ticket" || e?.event === "add_solution") {
//                 setTimeout(() => {
//                     const viewport = document.querySelector("#scroll-container [data-radix-scroll-area-viewport]");
//                     console.log("viewport", viewport);

//                     if (viewport) {
//                         viewport.scrollTop = viewport.scrollHeight + 100;
//                     }
//                 }, 2000);
//             }
//             // queryClient.invalidateQueries({ queryKey: key_getDetailTicketById });
//             // queryClient.invalidateQueries({ queryKey: key_getDataInfo });
//             // queryClient.invalidateQueries({ queryKey: key_getDataByGroup });
//         };
//     }, [cookies, ticket, sidebar, informationUser]); // 🔁 mỗi lần state đổi, update invalidate handler

//     // ✅ Gửi tin nhắn nếu cần
//     // const sendMessage = (message: string, chatId: number) => {
//     //     if (socketRef.current?.connected) {
//     //         socketRef.current.emit("chat_message", {
//     //             message,
//     //             chatId,
//     //             user_id: informationUser?.id,
//     //         });
//     //     } else {
//     //         console.warn("⚠️ Socket not connected");
//     //     }
//     // };

//     return {};
// };
