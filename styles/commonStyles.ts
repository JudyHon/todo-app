import { StyleSheet } from "react-native";

// Common flex patterns
const commonStyles = StyleSheet.create({
    // For container elements
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    spaceAround: {
        justifyContent: 'space-around',
    },
    // For child elements
    grow: {
        flex: 1,
    },
    noGrow: {
        flex: 0,
    },
    // Alignment
    alignStart: {
        alignItems: 'flex-start',
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    justifyStart: {
        justifyContent: 'flex-start',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    transparentBackground: {
        backgroundColor: 'rgba(0,0,0,0)',
    }
});

export default commonStyles;