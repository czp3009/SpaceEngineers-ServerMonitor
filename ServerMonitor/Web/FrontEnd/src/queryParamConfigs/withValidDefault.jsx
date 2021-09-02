import {withDefault} from "use-query-params";

export default function (param, defaultValue, validValues: Array = []) {
    if (!Array.isArray(validValues)) {
        validValues = [validValues]
    }
    if (!validValues.includes(defaultValue)) {
        validValues.push(defaultValue)
    }
    const {encode, decode, equals} = withDefault(param, defaultValue)
    const newDecode = (value) => {
        const decodedValue = decode(value)
        return validValues.includes(decodedValue) ? decodedValue : defaultValue
    }
    return {encode, decode: newDecode, equals}
}
