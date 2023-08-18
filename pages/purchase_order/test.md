...(data &&
props?.type === "order" &&
data?.item.length > 0
? data?.item.flatMap((item, index) => {
const row = [
{
text: `${index + 1}`,
alignment: "center",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.item?.name
? item?.item?.name
: "",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.item?.unit_name
? `${item?.item?.unit_name}`
: "",
alignment: "center",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.quantity
? `${formatNumber(
item?.quantity
)}`
: "",
alignment: "center",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.price
? `${formatNumber(item?.price)}`
: "",
alignment: "right",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.discount_percent
? `${
item?.discount_percent + "%"
}`
: "",
alignment: "center",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.price_after_discount
? `${formatNumber(
item?.price_after_discount
)}`
: "",
alignment: "right",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.tax_rate
? `${item?.tax_rate + "%"}`
: "",
alignment: "center",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.amount
? `${formatNumber(item?.amount)}`
: "",
alignment: "right",
fontSize: 10,
margin: styleMarginChild,
},
{
text: item?.note
? `${item?.note}`
: "",
fontSize: 10,
margin: styleMarginChild,
},
];

                                  const variationRow = [];
                                  if (item?.item?.product_variation) {
                                      variationRow.push(  {
                                        text: "",
                                        colSpan: 1,
                            },{
                                          text: `${
                                              props.dataLang
                                                  ?.purchase_variant ||
                                              "purchase_variant"
                                          }: ${item?.item?.product_variation}`,
                                          colSpan: 10,
                                          fontSize: 9,
                                          italics: true,
                                          margin: styleMarginChild,
                                      });
                                  }

                                  return variationRow.length > 0
                                      ? [row, variationRow]
                                      : [row];
                              })
                            : []),

                            ////
                             ...(data &&
                        props?.type === "order" &&
                        data?.item.length > 0
                            ? data?.item.reduce((result, item, index) => {
                                  const row = [
                                      {
                                          text: `${index + 1}`,
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.name
                                              ? item?.item?.name
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.unit_name
                                              ? `${item?.item?.unit_name}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price
                                              ? `${formatNumber(item?.price)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.discount_percent
                                              ? `${
                                                    item?.discount_percent + "%"
                                                }`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? `${formatNumber(
                                                    item?.price_after_discount
                                                )}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.tax_rate
                                              ? `${item?.tax_rate + "%"}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(item?.amount)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.note
                                              ? `${item?.note}`
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                  ];

                                  result.push(row);

                                  if (item?.item?.product_variation) {
                                      const variationRow = [
                                          {
                                              text: "",
                                              colSpan: 1,
                                          },
                                          {
                                              text: `${
                                                  props.dataLang
                                                      ?.purchase_variant ||
                                                  "purchase_variant"
                                              }: ${
                                                  item?.item?.product_variation
                                              }`,
                                              colSpan: 10,
                                              fontSize: 9,
                                              italics: true,
                                              margin: styleMarginChild,
                                          },
                                      ];

                                      result.push(variationRow);
                                  }

                                  return result;
                              }, [])
                            : []),
                            //////////////////////

                              ...(data &&
                        props?.type == "order" &&
                        data?.item.length > 0
                            ? data?.item.map((item, index) => {
                                  return [
                                      {
                                          text: `${index + 1}`,
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.name
                                              ? item?.item?.name
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      //   {
                                      //       text: item?.item
                                      //           ?.product_variation
                                      //           ? `${
                                      //                 props.dataLang
                                      //                     ?.purchase_variant ||
                                      //                 "purchase_variant"
                                      //             }: ${
                                      //                 item?.item
                                      //                     ?.product_variation
                                      //             }`
                                      //           : "",
                                      //       fontSize: 9,
                                      //       italics: true,
                                      //       colSpan: 9,
                                      //       //   margin: [0, 5, 0, 0],
                                      //       margin: styleMarginChild,
                                      //   },
                                      {
                                          text: item?.item?.unit_name
                                              ? `${item?.item?.unit_name}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price
                                              ? `${formatNumber(item?.price)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.discount_percent
                                              ? `${
                                                    item?.discount_percent + "%"
                                                }`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? `${formatNumber(
                                                    item?.price_after_discount
                                                )}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.tax_rate
                                              ? `${item?.tax_rate + "%"}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(item?.amount)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.note
                                              ? `${item?.note}`
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                  ];
                              })
                            : ""),

                            /////

                            ...(data &&
                        props?.type === "order" &&
                        data?.item.length > 0
                            ? data?.item.flatMap((item, index) => {
                                  const row = [
                                      {
                                          text: `${index + 1}`,
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.name
                                              ? item?.item?.name
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.unit_name
                                              ? `${item?.item?.unit_name}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price
                                              ? `${formatNumber(item?.price)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.discount_percent
                                              ? `${
                                                    item?.discount_percent + "%"
                                                }`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? `${formatNumber(
                                                    item?.price_after_discount
                                                )}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.tax_rate
                                              ? `${item?.tax_rate + "%"}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(item?.amount)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.note
                                              ? `${item?.note}`
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                  ];

                                  const variationRow = [];
                                  if (item?.item?.product_variation) {
                                      variationRow.push(
                                          //   {
                                          //       text: "",
                                          //       colSpan: 1,
                                          //   },
                                          //   {
                                          //       text: `${
                                          //           props.dataLang[
                                          //               item?.item?.text_type
                                          //           ]
                                          //       } - `,
                                          //       colSpan: 1,
                                          //       fontSize: 9,
                                          //       italics: true,
                                          //       margin: styleMarginChild,
                                          //   },

                                          {
                                              text: [
                                                  {
                                                      text: `${
                                                          props.dataLang[
                                                              item?.item
                                                                  ?.text_type
                                                          ]
                                                      } - `,
                                                      colSpan: 1,
                                                      fontSize: 9,
                                                      italics: true,
                                                      margin: styleMarginChild,
                                                  },
                                                  {
                                                      text: `${
                                                          props.dataLang
                                                              ?.purchase_variant ||
                                                          "purchase_variant"
                                                      }: ${
                                                          item?.item
                                                              ?.product_variation
                                                      }`,
                                                      colSpan: 8,
                                                      fontSize: 9,
                                                      italics: true,
                                                      margin: styleMarginChild,
                                                  },
                                              ],
                                              colSpan: 10,
                                              margin: styleMarginChild,
                                          }
                                      );
                                  }

                                  return variationRow.length > 0
                                      ? [row, variationRow]
                                      : [row];
                              })
                            : []),
