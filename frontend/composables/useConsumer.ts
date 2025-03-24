import { useAsyncData } from '#app';
import axios from 'axios';
import type { Node } from '~/types/Node';
import type { TreeInfo } from '~/types/TreeInfo';

export const useConsumer = async () => {
    const { data: structuredTree, error: structuredTreeError } = await useAsyncData<Node[]>('structuredTree', async () => {
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

    return {
        structuredTree,
        structuredTreeError,
        treeInfo,
        treeInfoError,
    };
};