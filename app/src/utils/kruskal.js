export class UnionFind {
    constructor(size) {
        this.parent = Array(size).fill().map((_, i) => i);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            this.parent[rootY] = rootX;
            return true;
        }
        return false;
    }
}

export function initializeKruskal(nodes, edges) {
    return {
        sortedEdges: [...edges].sort((a, b) => a.weight - b.weight),
        uf: new UnionFind(nodes.length),
        currentStep: 0,
        mstEdges: [],
        mstSequence: []
    };
}

export async function processNextEdge(kruskalState, setState, isPausedRef, stepDelay) {
    if (kruskalState.currentStep >= kruskalState.sortedEdges.length || isPausedRef.current) {
        if (kruskalState.currentStep >= kruskalState.sortedEdges.length) {
            setState(prev => ({ ...prev, isRunning: false, mstSequence: [...kruskalState.mstSequence] }));
        }
        return;
    }

    const edge = kruskalState.sortedEdges[kruskalState.currentStep];

    setState(prev => ({
        ...prev,
        currentEdge: edge
    }));

    await new Promise(resolve => setTimeout(resolve, stepDelay));

    if (kruskalState.uf.union(edge.from, edge.to)) {
        kruskalState.mstEdges.push(edge);
        kruskalState.mstSequence.push(`(${edge.from},${edge.to})`);
        setState(prev => ({
            ...prev,
            mstEdges: [...kruskalState.mstEdges]
        }));
    } else {
        setState(prev => ({
            ...prev,
            edges: prev.edges.map(e => (e.id === edge.id ? { ...e, color: 'gray' } : e))
        }));
    }

    kruskalState.currentStep++;

    setState(prev => ({
        ...prev,
        currentEdge: null
    }));

    if (!isPausedRef.current) {
        setTimeout(() => processNextEdge(kruskalState, setState, isPausedRef, stepDelay), stepDelay);
    }
}
