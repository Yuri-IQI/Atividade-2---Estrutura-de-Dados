export interface NodeRequest {
    nodeId: number,
    nodeValue: string,
    parentId: number | null,
    position: string | null
}