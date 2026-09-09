import { useEffect, useState } from 'react';

const DATASET_URL = `${import.meta.env.BASE_URL}data/cyber-actor-atlas.json`;

export function useDataset() {
  const [state, setState] = useState({ groups: [], loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function loadDataset() {
      try {
        const response = await fetch(DATASET_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Dataset request failed (${response.status})`);

        const groups = await response.json();
        if (!Array.isArray(groups)) throw new Error('Dataset response is not an array');
        setState({ groups, loading: false, error: null });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setState({ groups: [], loading: false, error: error.message });
        }
      }
    }

    loadDataset();
    return () => controller.abort();
  }, []);

  return state;
}
