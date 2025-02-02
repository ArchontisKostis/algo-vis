const Footer = () => {
    return (
        <>
            <footer style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5em",
                marginTop: "1em",
                fontSize: "0.9em",
            }}>
                <i className="bi bi-github"> </i> <a href="https://github.com/ArchontisKostis/algo-vis"
                                                     rel="noreferrer" target="_blank"> Source Code</a>
            </footer>
        </>
    )
}

export default Footer;