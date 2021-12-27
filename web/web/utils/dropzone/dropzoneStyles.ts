export const baseStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#5d7089",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
};

export const activeStyle: React.CSSProperties = {
    borderColor: "#2196f3",
};

export const acceptStyle: React.CSSProperties = {
    borderColor: "#00e676",
};

export const rejectStyle: React.CSSProperties = {
    borderColor: "#ff1744",
};

export const thumbsContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
};

export const thumb: React.CSSProperties = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
};

export const thumbInner: React.CSSProperties = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
};

export const img: React.CSSProperties = {
    display: "block",
    width: "auto",
    height: "100%",
};
