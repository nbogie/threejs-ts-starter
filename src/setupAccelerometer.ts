//It seems we need to install @types/w3c-generic-sensor

export function setupAccelerometer(callbackFn: (acl: Accelerometer) => void): void {
    const acl = new Accelerometer({ frequency: 60 });
    acl.addEventListener('reading', () => callbackFn(acl));
    acl.start();
}