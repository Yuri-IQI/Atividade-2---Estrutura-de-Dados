class TreeNode {
    constructor(id, value, parentId) {
        this.id = id;
        this.value = value;
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