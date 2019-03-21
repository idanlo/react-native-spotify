import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Text } from '../UI';
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
        fontSize: 34,
        fontWeight: 'bold'
    }
});
