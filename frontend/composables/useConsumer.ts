import { useAsyncData } from '#app';
import axios from 'axios';
import type { TreeNode } from '~/types/TreeNode';
import type { TreeInfo } from '~/types/TreeInfo';
import type { NodeInfo } from '~/types/NodeInfo';
import type { NodeFamilyInfo } from '~/types/NodeFamilyInfo';
import { TraversalTypes } from '~/types/TraversalTypes';

export const useConsumer = async (nodeId: number | null, traversalType: TraversalTypes | null) => {
    const fetchData = async <T>(key: string, url: string, options?: object) => {
        return useAsyncData<T>(key, async () => {
            try {
                const response = options
                    ? await axios.request({ url, ...options })
                    : await axios.get(url);
                return response.data;
            } catch (error) {
                console.error(`Error fetching ${key}:`, error);
                throw error;
            }
        });
    };

    const { data: structuredTree, error: structuredTreeError } = await fetchData<TreeNode[]>('structuredTree', 'https://cinco-backend-byr2.onrender.com/structured-tree');
    const { data: treeInfo, error: treeInfoError } = await fetchData<TreeInfo>('treeInfo', 'https://cinco-backend-byr2.onrender.com/tree-info');
    
    const { data: nodeInfo, error: nodeInfoError } = nodeId !== null
        ? await fetchData<NodeInfo>('nodeInfo', `https://cinco-backend-byr2.onrender.com/node-info/${nodeId}`)
        : { data: null, error: null };

    const { data: nodeFamilyInfo, error: nodeFamilyInfoError } = (nodeId !== null) && (nodeId !== 0)
        ? await fetchData<NodeFamilyInfo>('nodeFamilyInfo', `https://cinco-backend-byr2.onrender.com/node-family/${nodeId}`)
        : { data: null, error: null };

    const { data: traversalTree, error: traversalTreeError } = traversalType
        ? await fetchData<TreeNode[]>(
            'traversalTree', 
            `https://cinco-backend-byr2.onrender.com/traversal?traversalType=${encodeURIComponent(traversalType)}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        )
        : { data: null, error: null };    
    
    return {
        structuredTree,
        structuredTreeError,
        treeInfo,
        treeInfoError,
        nodeInfo,
        nodeInfoError,
        nodeFamilyInfo,
        nodeFamilyInfoError,
        traversalTree,
        traversalTreeError
    };
};