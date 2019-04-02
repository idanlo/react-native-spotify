import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Text } from '../UI';
import globalStyles from '../styles';

export default class Library extends React.Component {
    routeSubscription = null;

    componentDidMount() {
        // create route subscription to know when to re-fetch data because the component is mounted even if it is
        // not in the view, so react-navigation provides events
        this.routeSubscription = this.props.navigation.addListener(
            'willFocus',
            this.fetchData
        );
    }

    fetchData = ctx => {
        StatusBar.setBackgroundColor('#191414');
    };

    componentWillUnmount() {
        this.routeSubscription.remove();
    }

    render() {
        return (
            <View style={globalStyles.container}>
                <ScrollView>
                    <Text style={styles.header}>Library</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 34,
        fontWeight: 'bold'
    }
});
