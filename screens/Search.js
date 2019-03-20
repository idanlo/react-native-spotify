import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../styles';

export default function Search() {
    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Text style={styles.header}>Search</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        color: '#fff',
        fontSize: 34,
        fontWeight: 'bold'
    }
});
