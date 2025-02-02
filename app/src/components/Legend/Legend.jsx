import './Legend.css';

const Legend = ({ data }) => {
    return (
        <div className="legend">
            {data.map((item, index) => (
                <div>
                    <span style={{ backgroundColor: item.color }} ></span>{item.label}
                </div>
            ))}
        </div>
    );
}

export default Legend;