import type { Coordinates } from "./Coordinates";

export interface Connection {
    parentId: number,
    childId: number,
    parentCoordinates: Coordinates,
    childCoordinates: Coordinates
    connectionSide: string
}