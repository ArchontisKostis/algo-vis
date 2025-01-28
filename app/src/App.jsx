import { useState } from 'react';
import Graph from './components/Graph';
import GraphEditor from './components/GraphEditor';
import { UnionFind } from './utils/algorithms';
import { generateNodes, generateEdges } from './utils/graphGenerators';
import './App.css';
import {BallTriangle, Bars} from "react-loader-spinner";

export default function App() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mstEdges, setMstEdges] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [currentEdge, setCurrentEdge] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // For loading JSON graph data
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    // Check for valid data format
                    if (data.nodes && data.edges) {
                        setNodes(data.nodes);
                        setEdges(data.edges);
                        setMstEdges([]);
                        setCurrentEdge(null);
                    } else {
                        alert("Invalid graph data.");
                    }
                } catch (error) {
                    alert("Error parsing the file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const generateGraph = () => {
        const newNodes = generateNodes(7);
        const newEdges = generateEdges(newNodes, 8);
        setNodes(newNodes);
        setEdges(newEdges);
        setMstEdges([]);
        setCurrentEdge(null);
    };

    const startKruskal = async () => {
        if (!nodes.length) return;

        setIsRunning(true);
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
        const uf = new UnionFind(nodes.length);
        const mst = [];

        for (const edge of sortedEdges) {
            setCurrentEdge(edge); // Highlight the current edge (orange)
            await new Promise(resolve => setTimeout(resolve, 1500)); // Delay for visualization

            if (uf.union(edge.from, edge.to)) {
                // If added to MST, make it green
                mst.push(edge);
                setMstEdges([...mst]);
            } else {
                // If it forms a cycle, make it red temporarily
                edge.color = 'red';
                setEdges([...edges]);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to show rejection
                edge.color = 'gray'; // Reset to default
                setEdges([...edges]);
            }

            setCurrentEdge(null); // Reset current edge highlight
        }

        setIsRunning(false);
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setMstEdges([]);
        setCurrentEdge(null);
        if (!isEditing) {
            setNodes([]);
            setEdges([]);
        }
    };

    return (
        <div className="App">
            <div className="controls">
                <button onClick={toggleEditMode} className={isEditing ? 'btn btn-dark active' : 'btn btn-dark'}>
                    {isEditing ? 'Exit Edit Mode' : <i className="bi bi-pencil"> Custom</i>}
                </button>

                {!isEditing && (
                    <>
                        <button type="button" className={"btn btn-dark"} onClick={generateGraph} disabled={isRunning}>
                            <i className="bi bi-magic"> Random</i>
                        </button>
                        <button
                            type="button" className={"btn btn-success"}
                            onClick={startKruskal}
                            disabled={isRunning || nodes.length === 0}
                            title={nodes.length === 0 ? 'Generate a graph first' : 'Run Kruskal\'s Algorithm'}
                        >
                            {isRunning ?
                                <Bars
                                    height="20"
                                    width="20"
                                    color="#fff"
                                    ariaLabel="bars-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                />
                                :
                                <i className="bi bi-play-circle"></i>
                            }
                        </button>
                    </>
                )}

                {/* File upload button */}
                <div className="mb-3">
                    <input
                        className="form-control"
                        id="formFile"
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        style={{marginTop: '20px'}}
                    />
                </div>

            </div>

                <h5>
                    {isEditing ? <strong>Graph Editor</strong> : <><strong>Algorithm:</strong> Kruskal's </>}
                </h5>

                {isEditing ? (
                    <GraphEditor
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={setNodes}
                        onEdgesChange={setEdges}
                    />
                ) : (
                    <Graph
                        nodes={nodes}
                        edges={edges}
                        mstEdges={mstEdges}
                        currentEdge={currentEdge}
                    />
                )}

                <div className="legend">
                    <div><span style={{backgroundColor: '#FF5722'}}></span> Current Edge</div>
                    <div><span style={{backgroundColor: '#4CAF50'}}></span> MST Edge</div>
                    <div><span style={{backgroundColor: '#ddd'}}></span> Unprocessed Edge</div>
                    <div><span style={{backgroundColor: '#666'}}></span> Excluded Edge (forms cycle)</div>
                    {isEditing && (
                        <div className="edit-instructions">
                            Click canvas to add nodes | Click nodes to create edges
                        </div>
                    )}
                </div>
            </div>
            );
            }
