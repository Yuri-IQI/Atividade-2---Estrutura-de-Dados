const TreeNode = require('./TreeNode');

class BinaryTree {
    constructor() {
        this.treeNodes = [];
        this.root = null;
        this.nodeCounter = 0;
    }

    _assemblyLine(structuredTree, node) {
        if (!node) return;
    
        structuredTree.push(node);
    
        if (node.leftId) {
            let leftChild = this.findNodeById(node.leftId);
            this._assemblyLine(structuredTree, leftChild);
        }
    
        if (node.rightId) {
            let rightChild = this.findNodeById(node.rightId);
            this._assemblyLine(structuredTree, rightChild);
        }
    }
    
    getStructuredTree() {
        if (!this.root) return [];

        let structuredTree = [];
        structuredTree.push(this.root);
        
        this._assemblyLine(structuredTree, this.root);
    
        return structuredTree;
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
        if (node.leftId) degree++;
        if (node.rightId) degree++;
        return degree;
    }
    
    insert(value, parentValue) {
        if (!value || this.verifyNodeRepetition(value)) return false;
    
        const parentNode = parentValue != null ? this.findParentNode(parentValue) : null;
    
        if (!this.root) {
            if (parentNode) return false;
            this.root = this.createNode(value, null);
            this.treeNodes.push(this.root);
            return true;
        }
    
        if (parentValue && !parentNode) return false;
    
        if (parentNode && parentNode.leftId && parentNode.rightId) return false;
    
        const newNode = this.createNode(value, parentNode.id);
        this._insertNode(newNode, parentNode);
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

    _getNodeDepth(node) {
        if (!node || node.parentId === null || node.parentId === undefined) {
            return 0;
        }
    
        let parentNode = this.findNodeById(node.parentId);
        return 1 + this._getNodeDepth(parentNode);
    }
    
    getNodeDepth(value) {
        let node = this.findNodeByValue(value);
    
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
    
        return Math.max(...leafNodes.map(leaf => this.getNodeDepth(leaf.value)));
    }    

    getTreeInfo() {
        let treeDegree = this.getTreeDegree();
        let treeHeight = this.getTreeHeight();
        let treeLeafs = this.getLeafNodes();

        return {
            treeDegree: treeDegree,
            treeHeight: treeHeight,
            treeLevel: treeHeight,
            treeLeafs: treeLeafs
        }
    }

    getNodeInfo(value) {
        let node = this.findNodeByValue(value);
        if (!node) return null;
        
        let nodeDegree = node.degree;
        let nodeDepth = this.getNodeDepth(value);
        let nodeHeight = this.getNodeHeight(node);

        return {
            nodeDegree: nodeDegree,
            nodeDepth: nodeDepth,
            nodeHeight: nodeHeight,
            nodeLevel: nodeDepth + 1
        }
    }

    getNodeFamily(value) {
        let node = this.findNodeByValue(value);
    
        if (typeof node === null || node.parentId === null) {
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
