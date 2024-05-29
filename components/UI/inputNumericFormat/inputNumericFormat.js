import useSetingServer from "@/hooks/useConfigNumber";
import { NumericFormatCore } from '@/utils/lib/numericFormat'
const InPutNumericFormat = ({ className,
    value, onValueChange, isAllowed,
    allowNegative, isNumericString, readOnly,
    decimalScale, thousandSeparator, onChange,
    ref,
    decimalSeparator, disabled, placeholder }) => {
    const dataSeting = useSetingServer()
    return <NumericFormatCore
        className={`${className}`}
        value={value}
        onValueChange={onValueChange}
        onChange={onChange}
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