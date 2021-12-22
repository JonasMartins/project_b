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
