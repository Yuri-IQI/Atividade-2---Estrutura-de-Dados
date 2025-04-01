const TreeNode = require('./TreeNode');

class BinaryTree {
    constructor() {
        this.treeNodes = [];
        this.root = null;
        this.nodeCounter = 0;
    }   

    createNode(id, value, parentId, position) {
        return new TreeNode(id, value, parentId, position);
    }

    verifyNodeRepetition(value) {
        return this.treeNodes.some(node => node.nodeValue === value);
    }

    findNodeById(nodeId) {
        return this.treeNodes.find(node => node.nodeId === nodeId) || null;
    }

    findNodeByValue(value) {
        return this.treeNodes.find(node => node.nodeValue === value) || null;
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
        if (node.leftId) degree++;
        if (node.rightId) degree++;
        return degree;
    }
    
    insert(id, value, parentNode, position) {
        if (!value || this.verifyNodeRepetition(value)) return false;
        
        if (!this.root) {
            if (parentNode !== null) return false;
            this.root = this.createNode(id, value, parentNode);
            this.treeNodes.push(this.root);
            return true;
        }
    
        const newNode = this.createNode(id, value, parentNode.id, position);
        this.associateWithParent(newNode, parentNode, position);
        this.treeNodes.push(newNode);
        
        return true;
    }
    
    
    associateWithParent(newNode, parentNode, position) {
        if (!parentNode) return;
    
        if (position === 'L' && !parentNode.leftId) {
            parentNode.leftId = newNode.nodeId;
        } else if (position === 'R' && !parentNode.rightId) {
            parentNode.rightId = newNode.nodeId;
        } else {
            return;
        }
    
        parentNode.degree = this.calcNodeDegree(parentNode);
    
        const parentIndex = this.treeNodes.findIndex(node => node.nodeId === parentNode.nodeId);
        if (parentIndex !== -1) {
            this.treeNodes[parentIndex] = parentNode;
        }
    
        newNode.parentId = parentNode.nodeId;
    }
    
    getTreeDegree() {
        let highestDegree = 0;
        this.treeNodes.forEach(node => { if (node.degree > highestDegree) highestDegree = node.degree });

        return highestDegree;
    }

    _getNodeDepth(node) {
        if (!node || node.parentId === null || node.parentId === undefined) {
            return 0;
        }
    
        let parentNode = this.findNodeById(node.parentId);
        return 1 + this._getNodeDepth(parentNode);
    }
    
    getNodeDepth(node) {    
        if (!node) {
            return -1;
        }
    
        return this._getNodeDepth(node);
    }

    _getNodeHeight(node) {
        if (!node) return -1;
    
        if (!node.leftId && !node.rightId) return 0;
    
        const leftChild = this.findNodeById(node.leftId);
        const rightChild = this.findNodeById(node.rightId);
    
        const leftHeight = this._getNodeHeight(leftChild);
        const rightHeight = this._getNodeHeight(rightChild);
    
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    getNodeHeight(node) {
        return this._getNodeHeight(node);
    }

    getLeafNodes() {
        return this.treeNodes.filter(node => node.degree === 0);
    }

    getTreeHeight() {
        let leafNodes = this.getLeafNodes();
    
        if (leafNodes.length === 0) return 0;
    
        return Math.max(...leafNodes.map(leaf => this.getNodeDepth(leaf)));
    }    

    getTreeInfo() {
        let treeDegree = this.getTreeDegree();
        let treeHeight = this.getTreeHeight();
        let treeLeaves = this.getLeafNodes();

        if (this.treeNodes.length) treeHeight++;

        return {
            treeDegree: treeDegree,
            treeHeight: treeHeight,
            treeLevel: treeHeight,
            treeLeaves: treeLeaves,
            treeDepth: treeHeight ? treeHeight-1 : 0
        }
    }

    getNodeInfo(nodeId) {
        let node = this.findNodeById(nodeId);
        if (!node) return null;
        
        let nodeDegree = node.degree;
        let nodeDepth = this.getNodeDepth(node);
        let nodeHeight = this.getNodeHeight(node);

        return {
            nodeDegree: nodeDegree,
            nodeDepth: nodeDepth,
            nodeHeight: nodeHeight,
            nodeLevel: nodeDepth + 1
        }
    }

    getNodeFamily(nodeId) {
        let node = this.findNodeById(parseInt(nodeId));
    
        if (typeof node === null || node.parentId === null) {
            console.error("Node or parent not found");
            return null;
        }
    
        let parentNode = this.findNodeById(node.parentId);
    
        let siblingId = null;
        let isLeftChild = false;
        let isRightChild = false;

        if (parentNode.leftId === node.nodeId) {
            siblingId = parentNode.rightId;
            isLeftChild = true;
        } else {
            siblingId = parentNode.leftId;
            isRightChild = true;    
        }
        let siblingNode = siblingId ? this.findNodeById(siblingId) : null;
    
        let uncleNode = null;
        if (parentNode.parentId || parentNode.parentId === 0) {
            let grandParentNode = this.findNodeById(parentNode.parentId);

            let uncleId = grandParentNode.leftId === parentNode.nodeId ? grandParentNode.rightId : grandParentNode.leftId;
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

    doTraversal(traversalType) {
        if (!this.root) return [];
    
        switch (traversalType) {
            case "PREORDER":
                return this.preOrderTraversal(this.root, []);
            case "INORDER":
                return this.inOrderTraversal(this.root, []);
            case "POSTORDER":
                return this.postOrderTraversal(this.root, []);
            default:
                throw new Error(`Unsupported traversal type: ${traversalType}`);
        }
    }
    
    preOrderTraversal(node, orderedTree) {
        if (node === null) return orderedTree;
    
        orderedTree.push(node);
        this.preOrderTraversal(this.findNodeById(node.leftId), orderedTree);
        this.preOrderTraversal(this.findNodeById(node.rightId), orderedTree);
    
        return orderedTree;
    }
    
    inOrderTraversal(node, orderedTree) {
        if (node === null) return orderedTree;
    
        this.inOrderTraversal(this.findNodeById(node.leftId), orderedTree);
        orderedTree.push(node);
        this.inOrderTraversal(this.findNodeById(node.rightId), orderedTree);
    
        return orderedTree;
    }
    
    postOrderTraversal(node, orderedTree) {
        if (node === null) return orderedTree;
    
        this.postOrderTraversal(this.findNodeById(node.leftId), orderedTree);
        this.postOrderTraversal(this.findNodeById(node.rightId), orderedTree);
        orderedTree.push(node);
    
        return orderedTree;
    }
}

module.exports = BinaryTree;
