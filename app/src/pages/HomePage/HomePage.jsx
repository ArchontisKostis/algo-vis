import {Link} from "react-router-dom";
import PageCard from "../../components/PageCard/PageCard.jsx";

const HomePage = () => {
    return (
        <div>
            <h1 style={{fontSize: "1.5em", textAlign: "center"}}>Welcome to Algorithm Visualizer</h1>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <PageCard
                    title="Kruskal's Algorithm"
                    labels={[
                        "greedy",
                        "MST",
                        "graphs"
                    ]}
                    desc="
                        Kruskal's algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) by
                        selecting edges with the smallest weight, while avoiding cycles.
                    "
                    urlData={{to: "/kruskal", txt: "See Visualization"}}
                />

            </div>
        </div>
    )
}

export default HomePage;