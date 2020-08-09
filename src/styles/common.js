import { StyleSheet, StatusBar, Platform } from 'react-native';

import colors from './colors';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: Platform.select({
            ios: 0,
            android: StatusBar.currentHeight,
        }),
    },
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#191414',
        paddingTop: StatusBar.currentHeight,
    },
});
