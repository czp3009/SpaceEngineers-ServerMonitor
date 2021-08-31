export default function (a?: string, b?: string) {
    if (a === b) return 0
    if (b == null) return -1
    if (a == null) return 1
    return a < b ? -1 : 1
}
