import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Search() {
    return (
        <View style={styles.container}>
            <Text>Search</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191414'
    }
});
