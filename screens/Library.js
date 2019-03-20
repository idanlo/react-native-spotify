import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Library() {
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.header}>Library</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191414',
        paddingTop: StatusBar.currentHeight
    },
    header: {
        color: '#fff',
        fontSize: 34,
        fontWeight: 'bold'
    }
});
