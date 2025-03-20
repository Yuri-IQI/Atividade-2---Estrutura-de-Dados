const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const treeController = require('./src/controllers/treeController')
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.use(cors());
app.use(bodyParser.json());

app.post('/insert', treeController.insertNode);
app.get('/node-info/:value',treeController.getNodeInfo);
app.get('/tree-info',treeController.getTreeInfo);
app.get('/node-family/:value', treeController.getNodeFamily);
app.get('/traversal', treeController.doTraversal)
app.get('/structured-tree', treeController.getStructuredTree);

const APP_PORT = 4000;

app.listen(APP_PORT,() => {
    console.log('-------Servidor Rodando-------')
})