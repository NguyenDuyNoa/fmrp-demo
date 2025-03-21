const variantSlideLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
};

const variantSlideRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
};

const variantSlideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const variantSlideDown = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const variantSlideZoomOut = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
    },
};

const variantButtonBasic = {
    rest: { scale: 1 },
    press: { scale: 0.95, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const variantButtonPressZoom = {
    rest: { scale: 1 },
    press: { scale: 0.95, transition: { duration: 0.4 } },
    hover: { scale: 1, transition: { duration: 0.4 } },
};

const variantButtonScaleZoom = {
    rest: { scale: 1 },
    press: { scale: 0.95, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
};

const variantCardScaleZoom = {
    rest: { scale: 1 },
    press: { scale: 0.95, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
};


// animation đóng mở collapsed
const variantsContent = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
};

const variantsLinearShadow = {
    background: [
        "radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #1AD598, #1AD598)",
        "radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%), linear-gradient(0deg, #1AD598, #1AD598)",
        "radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #1AD598, #1AD598)"
    ],
    transition: {
        duration: 1.5,
        ease: [0.4, 0, 0.6, 1],
        repeat: Infinity
    },
    boxShadow: [
        "4px 8px 25px rgba(26, 213, 152, 0.25), inset -2px -2px 5px rgba(255,255,255,0.5), inset 2px 2px 4px rgba(0,0,0,0.15)",
        "4px 8px 25px rgba(26, 213, 152, 0.45), inset -3px -3px 6px rgba(255,255,255,0.7), inset 3px 3px 6px rgba(0,0,0,0.35)",
        "4px 8px 30px rgba(26, 213, 152, 0.35), inset -3px -3px 7px rgba(255,255,255,0.7), inset 3px 3px 7px rgba(0,0,0,0.4)",
        "4px 8px 25px rgba(26, 213, 152, 0.25), inset -2px -2px 5px rgba(255,255,255,0.5), inset 2px 2px 4px rgba(0,0,0,0.3)"
    ],
}

export {
    variantSlideLeft,
    variantSlideRight,
    variantSlideUp,
    variantSlideDown,
    variantSlideZoomOut,
    variantButtonPressZoom,
    variantButtonScaleZoom,
    variantCardScaleZoom,
    variantsContent,
    variantsLinearShadow,
    variantButtonBasic
};
