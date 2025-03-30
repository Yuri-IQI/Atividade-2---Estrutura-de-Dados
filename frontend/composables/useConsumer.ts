import { useAsyncData } from '#app';
import axios from 'axios';
import type { TreeNode } from '~/types/TreeNode';
import type { TreeInfo } from '~/types/TreeInfo';
import type { NodeInfo } from '~/types/NodeInfo';
import type { NodeFamilyInfo } from '~/types/NodeFamilyInfo';

export const useConsumer = async (nodeId: number | null) => {
    const { data: structuredTree, error: structuredTreeError } = await useAsyncData<TreeNode[]>('structuredTree', async () => {
        try {
            const response = await axios.get('http://localhost:4500/structured-tree');
            return response.data;
        } catch (error) {
            console.error('Error fetching structured tree:', error);
            throw error;
        }
    });

    const { data: treeInfo, error: treeInfoError } = await useAsyncData<TreeInfo>('treeInfo', async () => {
        try {
            const response = await axios.get('http://localhost:4500/tree-info');
            return response.data;
        } catch (error) {
            console.error('Error fetching tree info:', error);
            throw error;
        }
    });

    const { data: nodeInfo, error: nodeInfoError } = await useAsyncData<NodeInfo>('nodeInfo', async () => {
        if (nodeId || nodeId === 0) {
            const response = await axios.get(`http://localhost:4500/node-info/${nodeId}`);
            return response.data;
        }
    });

    const { data: NodeFamilyInfo, error: nodeFamilyInfoError } = await useAsyncData<NodeFamilyInfo>('nodeFamilyInfo', async () => {
        if (nodeId || nodeId === 0) {
            const response = await axios.get(`http://localhost:4500/node-family/${nodeId}`);
            return response.data;
        }
    });

    return {
        structuredTree,
        structuredTreeError,
        treeInfo,
        treeInfoError,
        nodeInfo,
        nodeInfoError,
        NodeFamilyInfo,
        nodeFamilyInfoError
    };
};