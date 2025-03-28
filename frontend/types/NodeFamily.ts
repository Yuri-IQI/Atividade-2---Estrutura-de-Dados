import type { TreeNode } from "./TreeNode";

export interface NodeFamily {
    parentNode: TreeNode | null,
    rightNode: TreeNode | null,
    leftNode: TreeNode | null
}