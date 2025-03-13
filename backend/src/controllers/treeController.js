const BinaryTree = require('../models/BinaryTree');
const tree = new BinaryTree();


exports.insertNode = (req, res) => {
    const { value } = req.body;
    if (typeof value !== 'number') {
        return res.status(400).json({ error: 'O valor deve ser um número' });
    }
    tree.insert(value);
    return res.status(200).json({ message: 'Nó inserido com sucesso' });
};


exports.getNodeInfo = (req, res) => {
    const { value } = req.params;
    const degree = tree.getNodeDegree(value);
    const depth = tree.getNodeDepth(value);
    const height = tree.getNodeHeight(value);
    const level = tree.getNodeLevel(value);
    const node = tree.find(value);
    const parent = node ? node.parent : null;
    const siblings = parent ? (parent.left !== node ? parent.left : parent.right) : null;
    const isLeftChild = parent && parent.left === node;

    return res.json({
        degree,
        depth,
        height,
        level,
        parent,
        siblings,
        isLeftChild
    });
};

exports.getTreeInfo = (req, res) => {
    const treeHeight = tree.getTreeHeight();
    const treeLevel = tree.getTreeLevel();
    const leafNodes = tree.findLeafNodes();

    return res.json({
        treeHeight,
        treeLevel,
        leafNodes
    });
};


exports.printTree = (req, res) => {
    tree.printTree(tree.root);
    return res.status(200).json({ message: 'Árvore impressa no console' });
};