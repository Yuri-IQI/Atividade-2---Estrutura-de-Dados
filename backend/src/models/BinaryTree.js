const TreeNode = require('./TreeNode');
const {set} = require("express/lib/application");
const e = require("express");

class BinaryTree {
    constructor() {
        this.treeNodes = new Set();
        this.root = null;
        this.nodeCounter = 0;
    }

    createNode(value, parentId) {
        return new TreeNode(this.nodeCounter++, value, parentId);
    }

    verifyNodeRepetition(value) {
        return [...this.treeNodes].some(node => node.value === value);
    }

    findNodeByValue(value) {
        return [...this.treeNodes].find(node => node.value === value) || null;
    }

    findParentNode(parentValue) {
        return this.findNodeByValue(parentValue);
    }

    compareValues(a, b) {
        if (typeof a === "number" && typeof b === "number") return a - b;
        if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
        return String(a).localeCompare(String(b));
    }

    insert(value, parentValue = null) {
        if (this.verifyNodeRepetition(value)) {
            console.log(`Value '${value}' already exists in the tree.`);
            return false;
        }

        const parentNode = parentValue != null ? this.findParentNode(parentValue) : null;

        if (parentValue && !parentNode) {
            console.error(`Parent node '${parentValue}' not found!`);
            return false;
        }

        const newNode = this.createNode(value, parentNode ? parentNode.id : null);

        if (!this.root) {
            this.root = newNode;
        } else {
            this._insertNode(newNode, parentNode);
        }

        this.treeNodes.add(newNode);
        return true;
    }

    _insertNode(newNode, parentNode) {
        if (!parentNode) {
            console.error("Parent node not found!");
            return;
        }

        if (!parentNode.leftId) {
            parentNode.leftId = newNode.id;
        } else if (!parentNode.rightId) {
            parentNode.rightId = newNode.id;
        } else {
            console.error("Parent already has two children!");
            return;
        }

        this.treeNodes.delete(parentNode);
        this.treeNodes.add(parentNode);
    }

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

module.exports = BinaryTree;
