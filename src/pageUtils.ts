export function logJSONToHTML(obj: unknown): void {

    const infoElem = document.getElementById("info");
    const numberReplacer = (k: string, v: unknown) => (typeof v === "number") ? v.toFixed(1) : v;
    if (infoElem) {
        infoElem.innerText = JSON.stringify(obj, numberReplacer, 2);
    }
}