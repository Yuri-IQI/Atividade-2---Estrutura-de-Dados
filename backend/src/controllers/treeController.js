const BinaryTree = require('../models/BinaryTree');
const tree = new BinaryTree();

exports.insertNode = (req, res) => {
    const { value, parent } = req.body;

    if (tree.verifyNodeRepetition(value)) {
        return res.status(400).json({ error: "O valor já está presente na árvore" });
    }

    let parentNode = parent ? tree.findParentNode(parent) : null;

    if (parent && !parentNode) {
        return res.status(400).json({ error: "O nó pai não foi encontrado" });
    }

    if (parentNode && parentNode.leftId && parentNode.rightId) {
        return res.status(400).json({ error: "O nó pai já possui dois filhos" });
    }

    tree.insert(value, parent);

    return res.status(201).json({ message: "Nó inserido com sucesso" });
};

exports.getNodeInfo = (req, res) => {
    const { value } = req.params;
    let nodeInfo = tree.getNodeInfo(value);

    if (!nodeInfo) return res.status(400).json({ error: "Nó não encontrado" });

    return res.json(nodeInfo);
};

exports.getTreeInfo = (req, res) => {
    return res.json(tree.getTreeInfo());
};

exports.getNodeFamily = (req, res) => {
    const { value } = req.params;
    const family = tree.getNodeFamily(value);

    if (!family) {
        return res.status(404).json({ error: 'Node or family not found' });
    }

    return res.json(family);
};

exports.doTraversal = (req, res) => {
    const { traversalType } = req.body;

    let traversalResult = tree.doTraversal(traversalType);
    if (traversalResult === null) return res.status(400).json({ error: "Incorrect traversal request" });

    return res.json(traversalResult);
}