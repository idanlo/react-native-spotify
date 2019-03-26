import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Text } from '../UI';
import globalStyles from '../styles';

export default function Search() {
    return (
        <View style={globalStyles.container}>
            <StatusBar backgroundColor="#191414" />
            <ScrollView>
                <Text style={styles.header}>Search</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 34,
        fontWeight: 'bold'
    }
});
