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
export default randomColor;
