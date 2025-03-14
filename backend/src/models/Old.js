class Old {
    constructor() {}

    find(value) {
        return this._findNode(this.root, value);
    }

    _findNode(node, value) {
        if (!node) return null;
        if (node.value === value) return node;
        return value < node.value ? this._findNode(node.left, value) : this._findNode(node.right, value);
    }

    getNodeDegree(value) {
        const node = this.find(value);
        return node ? node.getDegree() : -1; 
    }

    getNodeDepth(value) {
        let node = this.find(value);
        let depth = 0;
        while (node && node.parent) {
            depth++;
            node = node.parent;
        }
        return depth;
    }

    getTreeDepth() {
        return this._getTreeDepth(this.root);
    }

    _getTreeDepth(node) {
        if (!node) return 0;
        const leftDepth = this._getTreeDepth(node.left);
        const rightDepth = this._getTreeDepth(node.right);
        return Math.max(leftDepth, rightDepth) + 1;
    }

   
    getNodeHeight(value) {
        const node = this.find(value);
        return this._getHeight(node);
    }

    _getHeight(node) {
        if (!node) return -1;
        const leftHeight = this._getHeight(node.left);
        const rightHeight = this._getHeight(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    }


    getTreeHeight() {
        return this._getHeight(this.root);
    }


    getNodeLevel(value) {
        const node = this.find(value);
        return this.getNodeDepth(value); 
    }

 
    getTreeLevel() {
        return this.getTreeDepth(); 
    }


    findLeafNodes() {
        const leaves = [];
        this._findLeafNodes(this.root, leaves);
        return leaves;
    }

    _findLeafNodes(node, leaves) {
        if (node) {
            if (node.isLeaf()) {
                leaves.push(node.value);
            } else {
                this._findLeafNodes(node.left, leaves);
                this._findLeafNodes(node.right, leaves);
            }
        }
    }
 
    printTree(node, prefix = '') {
        if (node) {
            console.log(`${prefix}Node: ${node.value}`);
            this.printTree(node.left, `${prefix}  L-`);
            this.printTree(node.right, `${prefix}  R-`);
        }
    }

    preOrderTraversal(node) {
        if (node) {
            console.log(node.value);
            this.preOrderTraversal(node.left);
            this.preOrderTraversal(node.right);
        }
    }

    postOrderTraversal(node) {
        if (node) {
            this.postOrderTraversal(node.left);
            this.postOrderTraversal(node.right);
            console.log(node.value);
        }
    }

    inOrderTraversal(node) {
        if (node) {
            this.inOrderTraversal(node.left);
            console.log(node.value);
            this.inOrderTraversal(node.right);
        }
    }
}