export interface TreeNode {
    nodeId: number,
    nodeValue: any,
    leftId: number | null,
    rightId: number | null,
    parentId: number | null,
    degree: number | null,
    position: string | null
}