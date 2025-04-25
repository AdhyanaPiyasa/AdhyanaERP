// components/common/Table.js
const Table = ({ headers, data, onRowClick, maxHeight = "600px" }) => {
    const styles = {
      tableContainer: {
        width: "100%",
        maxHeight: maxHeight,
        overflow: "auto",
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.xl,
      },
      table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        position: "relative",
      },
      th: {
        padding: theme.spacing.md,
        textAlign: "left",
        borderBottom: `3px solid ${theme.colors.border}`,
        backgroundColor: "#f8f8ff",
        fontWeight: "bold",
        color: "black",
        position: "sticky",
        top: 0,
        zIndex: 10,
      },
      td: {
        padding: theme.spacing.md,
        borderBottom: `1px solid ${theme.colors.border}`,
        color: theme.colors.textPrimary,
      },
      tr: {
        cursor: onRowClick ? "pointer" : "default",
        backgroundColor: "#fffafa",
        transition: "background-color 0.2s",
        ":hover": {
          backgroundColor: theme.colors.background,
        },
      },
    };
  
    const renderCell = (cell) => {
      // If cell is a component (has type property)
      if (cell && typeof cell === "object" && "type" in cell) {
        return cell;
      }
      // If cell is null or undefined
      if (cell === null || cell === undefined) {
        return "";
      }
      // Default to string
      return String(cell);
    };
  
    return {
      type: "div",
      props: {
        style: styles.tableContainer,
        children: [
          {
            type: "table",
            props: {
              style: styles.table,
              children: [
                // Table Header
                {
                  type: "thead",
                  props: {
                    children: [
                      {
                        type: "tr",
                        props: {
                          children: headers.map((header) => ({
                            type: "th",
                            props: {
                              style: styles.th,
                              children: [header],
                            },
                          })),
                        },
                      },
                    ],
                  },
                },
                // Table Body
                {
                  type: "tbody",
                  props: {
                    children: data.map((row, rowIndex) => ({
                      type: "tr",
                      props: {
                        style: styles.tr,
                        onclick: onRowClick
                          ? () => onRowClick(row, rowIndex)
                          : undefined,
                        children: Object.values(row).map((cell) => ({
                          type: "td",
                          props: {
                            style: styles.td,
                            children: [renderCell(cell)],
                          },
                        })),
                      },
                    })),
                  },
                },
              ],
            },
          },
        ],
      },
    };
  };
  
  window.Table = Table;
  