export function isDefined(value: any) {
    if (value === undefined) return false;
    if (value === null) return false;
    return true;
}
