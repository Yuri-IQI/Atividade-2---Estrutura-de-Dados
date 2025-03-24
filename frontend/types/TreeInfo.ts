import type { Node } from "./Node";

export interface TreeInfo {
    treeDegree: number,
    treeHeight: number,
    treeLevel: number,
    treeLeaves: Node[]
} 