const LAYOUT_CIRCLE = 0.33;
const LAYOUT_GRID = 0.66;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GRID_SPACING = 100;
const CIRCLE_RADIUS = 250;
const NODE_OFFSET_X = 100;
const NODE_OFFSET_Y = 50;

/**
 * Generates nodes with different layouts (circle, grid, random)
 * @param {number} numNodes - Number of nodes to generate
 * @returns {Array} Array of node objects with id, x, and y
 */
export const generateNodes = (numNodes) => {
    const layoutType = Math.random();
    const nodes = [];
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    if (layoutType < LAYOUT_CIRCLE) {
        // **Circular Layout**
        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                id: i,
                x: centerX + CIRCLE_RADIUS * Math.cos((2 * Math.PI * i) / numNodes),
                y: centerY + CIRCLE_RADIUS * Math.sin((2 * Math.PI * i) / numNodes),
            });
        }
    } else if (layoutType < LAYOUT_GRID) {
        // **Grid Layout**
        const cols = Math.ceil(Math.sqrt(numNodes));
        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                id: i,
                x: centerX - (cols * GRID_SPACING) / 2 + (i % cols) * GRID_SPACING,
                y: centerY - (cols * GRID_SPACING) / 2 + Math.floor(i / cols) * GRID_SPACING,
            });
        }
    } else {
        // **Random Layout**
        for (let i = 0; i < numNodes; i++) {
            let x = Math.random() * (CANVAS_WIDTH - 2 * NODE_OFFSET_X) + NODE_OFFSET_X;
            let y = Math.random() * (CANVAS_HEIGHT - 2 * NODE_OFFSET_Y) + NODE_OFFSET_Y;

            // Ensure nodes are at least 50px apart
            while (nodes.some(node => Math.hypot(node.x - x, node.y - y) < 50)) {
                x = Math.random() * (CANVAS_WIDTH - 2 * NODE_OFFSET_X) + NODE_OFFSET_X;
                y = Math.random() * (CANVAS_HEIGHT - 2 * NODE_OFFSET_Y) + NODE_OFFSET_Y;
            }

            nodes.push({
                id: i,
                x: Math.random() * (CANVAS_WIDTH - 2 * NODE_OFFSET_X) + NODE_OFFSET_X,
                y: Math.random() * (CANVAS_HEIGHT - 2 * NODE_OFFSET_Y) + NODE_OFFSET_Y,
            });
        }
    }

    return nodes;
};

/**
 * Generates edges ensuring a connected graph, then adds extra edges
 * @param {Array} nodes - Array of node objects
 * @param {number} numExtraEdges - Number of extra edges to add
 * @returns {Array} Array of edge objects with id, from, to, and weight
 */
export const generateEdges = (nodes, numExtraEdges) => {
    const edges = [];
    const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);
    let edgeId = 0;

    // **Create a Spanning Tree**
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

    // **Add Extra Edges**
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
