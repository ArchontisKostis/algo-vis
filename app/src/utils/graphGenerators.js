export const generateNodes = (numNodes) => {
    return Array(numNodes).fill().map((_, i) => ({
        id: i,
        x: Math.random() * 700 + 50,
        y: Math.random() * 300 + 50,
    }));
};

export const generateEdges = (nodes, numExtraEdges) => {
    const edges = [];
    const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);
    let edgeId = 0;

    // Create spanning tree
    for (let i = 1; i < shuffledNodes.length; i++) {
        const node1 = shuffledNodes[i];
        const node2 = shuffledNodes[Math.floor(Math.random() * i)];
        edges.push({
            id: edgeId++,
            from: node1.id,
            to: node2.id,
            weight: Math.floor(Math.random() * 50) + 1,
        });
    }

    // Add extra edges
    const possibleEdges = new Set();
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            possibleEdges.add(`${Math.min(i, j)}-${Math.max(i, j)}`);
        }
    }

    edges.forEach(edge => {
        possibleEdges.delete(`${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`);
    });

    const possibleEdgesArray = Array.from(possibleEdges);
    for (let i = 0; i < Math.min(numExtraEdges, possibleEdgesArray.length); i++) {
        const idx = Math.floor(Math.random() * possibleEdgesArray.length);
        const [from, to] = possibleEdgesArray[idx].split('-').map(Number);
        edges.push({
            id: edgeId++,
            from,
            to,
            weight: Math.floor(Math.random() * 50) + 1,
        });
        possibleEdgesArray.splice(idx, 1);
    }

    return edges;
};