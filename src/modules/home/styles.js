import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    albumList: {
        width: '100%',
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
    },
    album: {
        height: 180,
        width: 170,
        alignItems: 'center',
    },
    albumImage: {
        height: 150,
        width: 150,
    },
    albumName: {
        fontWeight: 'bold',
        textAlign: 'center',
        width: 150,
    },
    artistImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
});

export default styles;
