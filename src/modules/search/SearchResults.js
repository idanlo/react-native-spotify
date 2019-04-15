import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles as globalStyles } from '../../styles';
import Text from '../../components/Text';

class SearchResults extends React.Component {
    state = {};

    fetchData = () => {
        // TODO: fetch data
    };

    render() {
        return (
            <View style={globalStyles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Icon
                            name="ios-arrow-back"
                            color="#fff"
                            size={30}
                            style={{ textAlign: 'center' }}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="#fff"
                        style={{
                            flex: 5,
                            textAlign: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                        }}
                    />
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={this.fetchData}
                    >
                        <Icon
                            name="ios-search"
                            color="#fff"
                            size={30}
                            style={{ textAlign: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffffff55',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});

export default SearchResults;
