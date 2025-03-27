class TreeNode {
    constructor(id, value, parentId, position) {
        this.nodeId = id;
        this.nodeValue = value;
        this.leftId = null;
        this.rightId = null;
        this.parentId = parentId;
        this.degree = 0;
        this.position = position;
    }

    isLeaf() {
        return !this.leftId && !this.rightId;
    }
}

module.exports = TreeNode;