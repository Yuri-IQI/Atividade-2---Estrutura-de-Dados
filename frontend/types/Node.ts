export interface Node {
    nodeId: number,
    nodeValue: any,
    leftId: number,
    rightId: number,
    parentId: number,
    degree: number
}