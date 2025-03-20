import { useAsyncData } from '#app';
import axios from 'axios';
import type { Node } from '~/types/Node';

export const useConsumer = async () => {
    const { data, error } = await useAsyncData<Node[]>('structuredTree', async () => {
        try {
            const response = await axios.get('http://localhost:4000/structured-tree');
            return response.data;
        } catch (err) {
            console.error('Error fetching structured tree:', err);
            throw err;
        }
    });

    if (error.value) {
        console.error('Error fetching structured tree:', error.value);
    }

    return data.value ?? [];
};