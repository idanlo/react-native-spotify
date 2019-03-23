import React from 'react';
import { View } from 'react-native';
import globalStyles from '../styles';
import { Text } from '../UI';

export default class PlayerView extends React.Component {
    static navigationOptions = {
        tabBarVisible: false
    };
    render() {
        return (
            <View style={globalStyles.container}>
                <Text>playerview</Text>
            </View>
        );
    }
}
