export interface TraversalTreeNode {
    nodeId: number,
    nodeValue: string,
    parentNode: TraversalTreeNode | null,
    leftChild: TraversalTreeNode | null,
    rightChild: TraversalTreeNode | null
}