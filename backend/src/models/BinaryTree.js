const TreeNode = require('./TreeNode');

class BinaryTree {
    constructor() {
        this.treeNodes = [];
        this.root = null;
        this.nodeCounter = 0;
    }

    createNode(value, parentId) {
        return new TreeNode(this.nodeCounter++, value, parentId);
    }

    verifyNodeRepetition(value) {
        return this.treeNodes.some(node => node.value === value);
    }

    findNodeById(nodeId) {
        return this.treeNodes.find(node => node.id === nodeId) || null;
    }

    findNodeByValue(value) {
        return this.treeNodes.find(node => node.value === value) || null;
    }

    findParentNode(parentValue) {
        return this.findNodeByValue(parentValue);
    }

    compareValues(a, b) {
        if (typeof a === "number" && typeof b === "number") return a - b;
        if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
        return String(a).localeCompare(String(b));
    }

    calcNodeDegree(node) {
        let degree = 0;
        if (node.left) degree++;
        if (node.right) degree++;
        return degree;
    }
    
    insert(value, parentValue = null) {
        if (this.verifyNodeRepetition(value)) return false;
    
        const parentNode = parentValue != null ? this.findParentNode(parentValue) : null;
        if (parentValue && !parentNode) return false;
    
        const newNode = this.createNode(value, parentNode ? parentNode.id : null);
    
        if (!this.root) {
            this.root = newNode;
        } else {
            this._insertNode(newNode, parentNode);
        }
    
        this.treeNodes.push(newNode);
        return true;
    }
    
    _insertNode(newNode, parentNode) {
        if (!parentNode) return;
    
        if (!parentNode.leftId) {
            parentNode.leftId = newNode.id;
        } else if (!parentNode.rightId) {
            parentNode.rightId = newNode.id;
        }
    
        parentNode.degree = this.calcNodeDegree(parentNode);
    
        const parentIndex = this.treeNodes.findIndex(node => node.id === parentNode.id);
        if (parentIndex !== -1) {
            this.treeNodes[parentIndex] = parentNode;
        }
    
        newNode.parentId = parentNode.id;
    }
    
    getTreeDegree() {
        let highestDegree = 0;
        this.treeNodes.forEach(node => { if (node.degree > highestDegree) highestDegree = node.degree });

        return highestDegree;
    }

    _getNodeDepth(node, depth) {
        if (node.parentId !== null) {
            let parentNode = node.parentId;
            this._getNodeDepth(node, depth + 1);
        }

        return depth;
    }

    getNodeDepth(value) {
        let node = this.findNodeByValue(value);

        if (!node) {
            return -1;
        }

        let depth = 0;
        return this._getNodeDepth(node, depth);
    }

    getLeafNodes() {
        return this.treeNodes.filter(node => node.degree === 0);
    }

    getTreeDepth() {
        let leafNodes = this.getLeafNodes();
        let distanceMap = new Map();

        leafNodes.forEach(leaf => {
            let depth = this.getNodeDepth(leaf.value);
            distanceMap.set(leaf.value, depth);
        })

        let highestDistance = 0;
        for (let distance of distanceMap.values()) {
            if (distance > highestDistance) {
                highestDistance = distance;
            }
        }

        return highestDistance;
    }

    getNodeFamily(value) {
        let node = this.findNodeByValue(value);
    
        if (!node || !node.parentId) {
            console.error("Node or parent not found");
            return null;
        }
    
        let parentNode = this.findNodeById(node.parentId);
    
        let siblingId = null;
        let isLeftChild = false;
        let isRightChild = false;

        if (parentNode.leftId === node.id) {
            siblingId = parentNode.rightId;
            isLeftChild = true;
        } else {
            siblingId = parentNode.leftId;
            isRightChild = true;    
        }
        let siblingNode = siblingId ? this.findNodeById(siblingId) : null;
    
        let uncleNode = null;
        if (parentNode.parentId) {
            let grandParentNode = this.findNodeById(parentNode.parentId);

            let uncleId = grandParentNode.leftId === parentNode.id ? grandParentNode.rightId : grandParentNode.leftId;
            uncleNode = uncleId ? this.findNodeById(uncleId) : null;
        }
    
        return {
            parent: parentNode,
            sibling: siblingNode,
            uncle: uncleNode,
            isLeftChild: isLeftChild,
            isRightChild: isRightChild
        };
    }
}

module.exports = BinaryTree;
