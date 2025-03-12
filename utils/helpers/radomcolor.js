// const colors = [
//     "bg-red-500",
//     "bg-blue-700",
//     "bg-green-600",
//     "bg-yellow-400",
//     "bg-purple-600",
//     "bg-indigo-500",
//     "bg-pink-400",
//     "bg-orange-500",
//     "bg-teal-400",
//     "bg-cyan-600",
//     "bg-lime-500",
// ];

// const randomColor = colors[Math.floor(Math.random() * colors.length)];
// export default randomColor;
const randomColor = () => {
    const colors = [
        "bg-red-500",
        "bg-blue-700",
        "bg-green-600",
        "bg-yellow-400",
        "bg-purple-600",
        "bg-indigo-500",
        "bg-pink-400",
        "bg-orange-500",
        "bg-teal-400",
        "bg-cyan-600",
        "bg-lime-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const getColorByParam = (param) => {
    const colors = {
        'a': ["#38bdf8", "#0ea5e9"], 'b': ["#38bdf8", "#3b82f6"], 'c': ["#fb923c", "#ea580c"],
        'd': ["#d8b4fe", "#a855f7"], 'e': ["#c084fc", "#ec4899"], 'f': ["#4ade80", "#22c55e"],
        'g': ["#fb7185", "#f43f5e"], 'h': ["#34d399", "#10b981"], 'i': ["#facc15", "#eab308"],
        'j': ["#94a3b8", "#64748b"], 'k': ["#e879f9", "#d946ef"], 'l': ["#38bdf8", "#0ea5e9"],
        'm': ["#38bdf8", "#3b82f6"], 'n': ["#fb923c", "#ea580c"], 'o': ["#d8b4fe", "#a855f7"],
        'p': ["#c084fc", "#ec4899"], 'q': ["#4ade80", "#22c55e"], 'r': ["#fb7185", "#f43f5e"],
        's': ["#34d399", "#10b981"], 't': ["#facc15", "#eab308"], 'u': ["#94a3b8", "#64748b"],
        'v': ["#e879f9", "#d946ef"], 'w': ["#38bdf8", "#0ea5e9"], 'x': ["#38bdf8", "#3b82f6"],
        'y': ["#fb923c", "#ea580c"], 'z': ["#d8b4fe", "#a855f7"]
    };

    if (!param || typeof param !== 'string') return colors['a'];

    const firstChar = param.charAt(0).toLowerCase();
    return colors[firstChar] || colors['a'];
};


export const getRandomColors = () => {
    const colors = [
        ["#38bdf8", "#0ea5e9"],
        ["#38bdf8", "#3b82f6"],
        ["#fb923c", "#ea580c"],
        ["#d8b4fe", "#a855f7"],
        ["#c084fc", "#ec4899"],
        ["#4ade80", "#22c55e"],
        ["#fb7185", "#f43f5e"],
        ["#34d399", "#10b981"],
        ["#facc15", "#eab308"],
        ["#94a3b8", "#64748b"],
        ["#e879f9", "#d946ef"],
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};
export default randomColor;
