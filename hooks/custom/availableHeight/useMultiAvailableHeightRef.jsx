import { useCallback, useRef } from "react";

export const useMultiAvailableHeightRef = () => {
    const heightMapRef = useRef({});

    const getElementHeightWithMargin = (el) => {
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const height = el.getBoundingClientRect().height || 0;
        return height + marginTop + marginBottom;
    };

    const calcHeights = useCallback(
        (config = {}) => {
            const newHeights = {};
            for (const key in config) {
                if (!config[key]) continue; // 💥 bỏ qua key không có giá trị

                const { refs = [], subtract = 0 } = config[key];
                const total = refs.reduce((sum, ref) => sum + getElementHeightWithMargin(ref?.current), 0);
                newHeights[key] = window.innerHeight - total - subtract;
            }
            heightMapRef.current = newHeights;
        },
        []
    );

    return { heightMapRef, calcHeights };
};