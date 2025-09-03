// MUI components
import { Typography, Link as MuiLink, Divider } from "@mui/material"

// Styles
import styles from "@/utils/markdownStyles"

/**
 * Define the equivalent MUI element for Markdwon rendering in the details tab.
 */
const markdownComponents = (theme) => {
  // Get styles for the component
  const markdownStyles = styles(theme)

  return {
    // --- Block-level ---
    p: (props) => (
      <Typography
        variant="body1"
        className={markdownStyles.applianceDescription}
        {...props}
      />
    ),
    h1: (props) => <Typography variant="h3" gutterBottom {...props} />,
    h2: (props) => <Typography variant="h4" gutterBottom {...props} />,
    h3: (props) => <Typography variant="h5" gutterBottom {...props} />,
    h4: (props) => <Typography variant="h6" gutterBottom {...props} />,
    h5: (props) => <Typography variant="subtitle1" gutterBottom {...props} />,
    h6: (props) => <Typography variant="subtitle2" gutterBottom {...props} />,
    ul: (props) => (
      <ul style={{ paddingLeft: "1.5rem", marginTop: 0 }} {...props} />
    ),
    ol: (props) => (
      <ol style={{ paddingLeft: "1.5rem", marginTop: 0 }} {...props} />
    ),
    li: (props) => (
      <li style={{ marginBottom: "0.25rem" }}>
        <Typography component="span" variant="body1" {...props} />
      </li>
    ),
    blockquote: (props) => (
      <Typography
        variant="body1"
        sx={{
          borderLeft: "4px solid #ccc",
          pl: 2,
          color: "text.secondary",
          fontStyle: "italic",
          my: 2,
        }}
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        style={{
          background: "#f5f5f5",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          overflowX: "auto",
        }}
        {...props}
      />
    ),
    hr: (props) => <Divider sx={{ my: 2 }} {...props} />,
    table: (props) => (
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginBottom: "1rem",
        }}
        {...props}
      />
    ),
    thead: (props) => (
      <thead style={{ borderBottom: "2px solid #ddd" }} {...props} />
    ),
    tbody: (props) => <tbody {...props} />,
    tr: (props) => <tr style={{ borderBottom: "1px solid #eee" }} {...props} />,
    th: (props) => (
      <th
        style={{ textAlign: "left", padding: "0.5rem", fontWeight: 600 }}
        {...props}
      />
    ),
    td: (props) => <td style={{ padding: "0.5rem" }} {...props} />,

    // --- Inline ---
    a: (props) => (
      <MuiLink className={markdownStyles.applianceRef} {...props} />
    ),
    strong: (props) => (
      <Typography component="span" fontWeight="bold" {...props} />
    ),
    em: (props) => (
      <Typography component="span" fontStyle="italic" {...props} />
    ),
    code: (props) => (
      <Typography
        component="code"
        sx={{
          fontFamily: "monospace",
          backgroundColor: "#f5f5f5",
          px: 0.5,
          borderRadius: 1,
        }}
        {...props}
      />
    ),
    del: (props) => (
      <Typography
        component="span"
        sx={{ textDecoration: "line-through" }}
        {...props}
      />
    ),
    br: () => <br />,
  }
}

export default markdownComponents
