class TreeNode {
    constructor(id, value) {
        this.id = id;
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;
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
