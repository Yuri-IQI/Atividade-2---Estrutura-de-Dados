const BinaryTree = require('../models/BinaryTree');
const tree = new BinaryTree();

exports.getStructuredTree = (req, res) => {
    res.json(tree.doTraversal('PREORDER'));
};

exports.insertNode = (req, res) => {
    const { nodeId, nodeValue, parentId, position } = req.body;

    if (!nodeValue) {
        return res.status(400).json({ error: "O valor do nó é obrigatório" });
    }

    if (tree.verifyNodeRepetition(nodeValue)) {
        return res.status(400).json({ error: "O valor já está presente na árvore" });
    }

    const parentNode = parentId !== null ? tree.findNodeById(parentId) : null;

    if (parentId && parentNode === null) {
        return res.status(400).json({ error: "O nó pai não foi encontrado" });
    }

    if (parentNode !== null && parentNode.leftId && parentNode.rightId) {
        return res.status(400).json({ error: "O nó pai já possui dois filhos" });
    }

    if ((position === 'L' && parentNode.leftId) || (position === 'R' && parentNode.rightId)) {
        return res.status(400).json({ error: "Já existe um nó nessa posição" })
    }

    if (!tree.insert(nodeId, nodeValue, parentNode, position)) {
        return res.status(400).json({ error: "Nó inválido: apenas um único nó raiz permitido" });
    }

    res.status(201).json({ message: "Nó inserido com sucesso", tree: tree.doTraversal('PREORDER') });
};


exports.getNodeInfo = (req, res) => {
    const { value } = req.params;
    const nodeInfo = tree.getNodeInfo(value);

    if (!nodeInfo) {
        return res.status(404).json({ error: "Nó não encontrado" });
    }

    res.json(nodeInfo);
};

exports.getTreeInfo = (req, res) => {
    res.json(tree.getTreeInfo());
};

exports.getNodeFamily = (req, res) => {
    const { value } = req.params;
    const family = tree.getNodeFamily(value);

    if (!family) {
        return res.status(404).json({ error: "Nó ou família não encontrados" });
    }

    res.json(family);
};

exports.doTraversal = (req, res) => {
    const { traversalType } = req.body;
    const traversalResult = tree.doTraversal(traversalType);

    if (!traversalResult) {
        return res.status(400).json({ error: "Tipo de travessia inválido" });
    }

    res.json(traversalResult);
};