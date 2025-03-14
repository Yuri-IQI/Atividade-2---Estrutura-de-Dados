class TreeNode {
    constructor(id, value, parentId) {
        this.id = id;
        this.value = value;
        this.left = null;
        this.right = null;
        this.parentId = parentId;
    }

    isLeaf() {
        return !this.left && !this.right;
    }


    getDegree() {
        let degree = 0;
        if (this.left) degree++;
        if (this.right) degree++;
        return degree;
    }
}

module.exports = TreeNode;
