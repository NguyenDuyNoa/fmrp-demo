import useSetingServer from "@/hooks/useConfigNumber"
import { NumericFormat } from "react-number-format"
const InPutNumericFormat = ({ className,
    value, onValueChange, isAllowed,
    allowNegative, isNumericString, readOnly,
    decimalScale, thousandSeparator,
    decimalSeparator, disabled, placeholder }) => {
    const dataSeting = useSetingServer()
    return <NumericFormat
        className={`${className}`}
        value={value}
        onValueChange={onValueChange}
        isAllowed={isAllowed}
        allowNegative={allowNegative}
        thousandSeparator={dataSeting?.thousand_separator || thousandSeparator}
        decimalSeparator={dataSeting?.decimal_separator || decimalSeparator}
        isNumericString={isNumericString}
        decimalScale={decimalScale}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
    />
}
export default InPutNumericFormat