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

    const { data: structuredTree, error: structuredTreeError } = await fetchData<TreeNode[]>('structuredTree', 'http://localhost:4500/structured-tree');
    const { data: treeInfo, error: treeInfoError } = await fetchData<TreeInfo>('treeInfo', 'http://localhost:4500/tree-info');
    
    const { data: nodeInfo, error: nodeInfoError } = nodeId !== null
        ? await fetchData<NodeInfo>('nodeInfo', `http://localhost:4500/node-info/${nodeId}`)
        : { data: null, error: null };

    const { data: nodeFamilyInfo, error: nodeFamilyInfoError } = (nodeId !== null) && (nodeId !== 0)
        ? await fetchData<NodeFamilyInfo>('nodeFamilyInfo', `http://localhost:4500/node-family/${nodeId}`)
        : { data: null, error: null };

    const { data: traversalTree, error: traversalTreeError } = traversalType
        ? await fetchData<TreeNode[]>(
            'traversalTree', 
            `http://localhost:4500/traversal?traversalType=${encodeURIComponent(traversalType)}`,
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