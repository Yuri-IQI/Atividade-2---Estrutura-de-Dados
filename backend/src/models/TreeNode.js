class TreeNode {
    constructor(id, value, parentId) {
        this.nodeId = id;
        this.nodeValue = value;
        this.leftId = null;
        this.rightId = null;
        this.parentId = parentId;
        this.degree = 0;
    }

    isLeaf() {
        return !this.left && !this.right;
    }
}

module.exports = TreeNode;