// export const styleHeaderTable = {
//     noWrap: true,
//     bold: true,
//     color: "black",
//     fontSize: 10,
//     margin: [5, 15, 5, 15],
// };

export const styleMarginChild = [0, 4, 0, 4];

export const styleMarginChildTotal = [0, 4, 0, 4];

export const uppercaseTextHeaderTabel = (text, style, alignment) => {
    return {
        text: text.charAt(0).toUpperCase() + text.slice(1),
        style: style,
        alignment: alignment,
    };
};

export const styles = {
    headerInfoTextWithMargin: {
        fontSize: 12,
        bold: true,
        margin: [2, 0, 0, 0],
    },
    headerLogo: {
        alignment: "left",
    },
    headerTables: {
        noWrap: true,
        bold: true,
        fillColor: "white",
        color: "black",
        fontSize: 10,
        margin: [5, 10, 5, 10],
        // alignment: 'center',
    },
    headerInfo: {
        alignment: "right",
        fontSize: 12,
        bold: true,
        color: "#0F4F9E",
        margin: [0, 1],
    },
    headerInfoText: {
        alignment: "right",
        fontSize: 8,
        italics: true,
        color: "black",
        margin: [0, 2],
    },
    contentTitle: {
        bold: true,
        fontSize: 20,
        alignment: "center",
        margin: [0, 10, 0, 2],
    },
    contentDate: {
        italics: true,
        fontSize: 8,
        alignment: "center",
    },
    headerTable: {
        noWrap: true,
        bold: true,
        color: "black",
        fontSize: 10,
        margin: [5, 10, 5, 10],
    },
    dateText: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 2],
    },
    signatureText: {
        fontSize: 12,
        margin: [0, 0, 0, 2],
    },
    dateTexts: {
        fontSize: 10,
        bold: false,
        margin: [0, 2, 0, 2],
    },
};
