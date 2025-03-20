import { useAsyncData } from '#app';
import type { Node } from '~/types/Node';

export const useConsumer = async () => {
    const { data, error } = await useAsyncData<Node[]>('structuredTree', () =>
        $fetch('http://localhost:4000/structured-tree')
    );

    if (error.value) {
        console.error('Error fetching structured tree:', error.value);
    }

    return data.value ?? [];
};