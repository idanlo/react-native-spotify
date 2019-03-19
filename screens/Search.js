import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Search() {
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.header}>Search</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191414'
    },
    header: {
        color: '#fff',
        fontSize: 34,
        fontWeight: 'bold'
    }
});
