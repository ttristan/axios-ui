import { CSSProperties } from "react";

// make sure to only use valid CSSProperties and also type available style keys
const createStyles = <T extends { [name: string]: CSSProperties }>(styles: T) =>
  styles;

const colors = {
  white: "#fff",
  icon: '#5A2AE4',
  background: "rgb(34, 46, 62)",
  red: "rgb(232, 68, 68)",
  green: "rgb(33, 182, 33)",
  orange: "orange",
  blue: "rgb(38, 171, 218)",
  blueDark: "rgb(113, 113, 255)",
  muted: "rgb(133, 149, 167)",
  buttonBackground: "rgb(63, 78, 96)",
  codeBackground: "rgb(16, 22, 29)",
  codeBorder: "rgb(31, 43, 57)",
};

const styles = createStyles({
  devtools: {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    height: "40vh",
    minHeight: "20vh",
    maxHeight: "80vh",
    backgroundColor: colors.background,
    color: colors.white,
    padding: "10px",
    overflowY: "auto",
    width: "100%",
    resize: "vertical",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: "99999",
    fontSize: "90%",
    paddingBottom: "60px",
  },

  icon: {
    border: "none",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fill: colors.icon,
    backgroundColor: "transparent",
  },

  button: {
    border: "none",
    position: "fixed",
    bottom: "10px",
    backgroundColor: colors.buttonBackground,
    padding: "2px 4px",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "80%",
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
    backgroundColor: colors.codeBackground,
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
    borderLeft: `4px solid ${colors.codeBorder}`,
    marginLeft: "42px",
    marginBottom: "20px",
  },

  method: {
    display: "flex",
    minWidth: 32,
  },

  methodGET: {
    color: colors.green,
  },

  methodPOST: {
    color: colors.orange,
  },

  methodDELETE: {
    color: colors.red,
  },

  methodPUT: {
    color: colors.blue,
  },

  url: {
    fontFamily: "monospace",
    wordBreak: "break-all",
  },

  urlNoResponse: {
    color: colors.red,
  },

  urlCollapsed: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },

  requestDetail: {
    fontFamily: "monospace",
    color: colors.muted,
  },

  showFullResponse: {
    border: "none",
    backgroundColor: "transparent",
    marginTop: "5px",
    cursor: "pointer",
  },

  requestFailed: {
    color: colors.red
  }
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
