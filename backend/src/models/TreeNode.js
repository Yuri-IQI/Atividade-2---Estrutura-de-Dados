class TreeNode {
    constructor(id, value, parentId) {
        this.id = id;
        this.value = value;
        this.left = null;
        this.right = null;
        this.parentId = parentId;
        this.degree = 0;
    }

    isLeaf() {
        return !this.left && !this.right;
    }
}

module.exports = TreeNode;