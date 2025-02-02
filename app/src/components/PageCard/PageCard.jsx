const LABEL_COLORS = [
    {
        label: 'greedy',
        style: 'bg-primary'
    },

    {
        label: 'MST',
        style: 'bg-success'
    },

    {
        label: 'graphs',
        style: 'bg-warning'
    }
]



const PageCard = ({ title, labels, desc, urlData }) => {
    return (
        <>
            <div className="card" style={{
                width: "18rem",
                margin: "1em",
                boxShadow: "0 2px 6px 0 rgba(0,0,0,0.05)",
                transition: "0.3s",
                borderRadius: "10px",
            }}>
                <div className="card-body">
                    <h5 className="card-title">
                        {title}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">
                        {labels && labels.map((label, index) => (
                            <span
                                key={index}
                                className={"badge " + LABEL_COLORS.find(lc => lc.label === label) ?.style} style={{marginRight: "5px"}}>
                                {label}
                            </span>
                        ))}
                    </h6>

                    <p className="card-text" style={{
                        textAlign: "justify",
                    }}>
                        {desc}
                    </p>
                    <a href={urlData.to} className="card-link">
                        {urlData.txt} <i className={"bi bi-arrow-right"}> </i>
                    </a>
                </div>
            </div>
        </>
    )
}

export default PageCard;