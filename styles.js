import { StyleSheet, StatusBar } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#191414',
        paddingTop: StatusBar.currentHeight
    }
});

export default styles;
