import type { TreeNode } from "./TreeNode";

export interface NodeFamilyInfo {
    parent: TreeNode,
    sibling: TreeNode | null,
    uncle: TreeNode | null,
    isLeftChild: boolean,
    isRightChild: boolean
}