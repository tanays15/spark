import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: `"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace`,
    },
    palette: {
        primary: {
            main: "#d6452c",
        },
        secondary: {
            main: "#370173",
        },
    },
});

export default theme;
