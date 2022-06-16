import { Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils";

export function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randomWorldPos(spread: number): Vector3 {
    return new Vector3(randFloatSpread(spread), randFloatSpread(spread), randFloatSpread(spread))
}