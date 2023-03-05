import { CSSProperties } from "react";

// make sure to only use valid CSSProperties and also type available style keys
const createStyles = <T extends { [name: string]: CSSProperties }>(styles: T) =>
  styles;

const styles = createStyles({
  devtools: {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    height: "40vh",
    minHeight: "20vh",
    maxHeight: "80vh",
    backgroundColor: "rgb(34, 46, 62)",
    color: "#fff",
    padding: "10px",
    overflowY: "auto",
    width: "100%",
    resize: "vertical",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: "99999",
    fontSize: "80%",
    paddingBottom: "60px",
  },

  icon: {
    border: 'none',
    cursor: "pointer",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fill: "#5A2AE4",
    backgroundColor: 'transparent',
  },

  button: {
    border: 'none',
    position: "fixed",
    bottom: "10px",
    backgroundColor: "rgb(63, 78, 96)",
    padding: "2px 4px",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: '80%',
  },

  clearButton: {
    bottom: "36px",
  },

  pre: {
    position: "relative",
    fontFamily: "monospace",
    height: "auto",
    minHeight: "30px",
    maxHeight: "28vh",
    overflowY: "auto",
    backgroundColor: "rgb(16, 22, 29)",
    padding: "10px",
    borderRadius: "4px",
    maxWidth: "100%",
    wordWrap: "break-word",
    resize: "vertical",
    marginTop: "5px",
    whiteSpace: "pre-wrap",
  },

  requestRow: {
    display: "flex",
    gap: "10px",
    cursor: "pointer",
    fontFamily: "monospace",
  },

  selectedRequest: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    paddingLeft: "10px",
    borderLeft: "4px solid rgb(31, 43, 57)",
    marginLeft: "30px",
    marginBottom: "20px",
  },

  selectedRequestTitle: {
    display: "block",
    color: "rgb(113, 131, 152)",
  },

  method: {
    display: "flex",
  },

  methodGET: {
    color: "rgb(33, 182, 33)",
  },

  methodPOST: {
    color: "orange",
  },

  methodDELETE: {
    color: "rgb(255, 15, 15)",
  },

  methodPUT: {
    color: "rgb(113, 113, 255)",
  },

  url: {
    fontFamily: "monospace",
    wordBreak: "break-all",
  },

  urlCollapsed: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },

  date: {
    fontFamily: "monospace",
    color: "rgb(133, 149, 167)",
  },

  showFullResponse: {
    border: 'none',
    backgroundColor: 'transparent',
    marginTop: "5px",
    cursor: "pointer",
  },
});

export default styles;

export type StylesKey = keyof typeof styles;
export type Style = typeof styles[StylesKey];
export type Styles = typeof styles;

export const getStyle = (styles: Styles, key: string): Style | {} => {
  if (styles[key as StylesKey]) {
    return styles[key as StylesKey];
  }
  return {};
};
