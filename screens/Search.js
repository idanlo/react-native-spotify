import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Dimensions,
    TextInput
} from 'react-native';
import { Text } from '../UI';
import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../styles';

const { width } = Dimensions.get('screen');

export default function Search() {
    console.log(StatusBar.currentHeight);
    return (
        <View style={{ backgroundColor: '#191414' }}>
            <ScrollView>
                <LinearGradient
                    colors={['#fff', '#191414']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 3, y: 3 }}
                    locations={[0, 0.1]}
                >
                    <StatusBar
                        translucent={true}
                        backgroundColor={'transparent'}
                    />
                    <View style={{ marginTop: 50 }}>
                        <Text bold size={34} style={styles.header}>
                            Search
                        </Text>
                        <TextInput
                            onEndEditing={e => console.log(e.nativeEvent.text)}
                            placeholder="Artists, song or playlists"
                            placeholderTextColor="#363636"
                            style={{
                                width: '75%',
                                alignSelf: 'center',
                                backgroundColor: '#F7F7F7',
                                textAlign: 'center',
                                borderRadius: 7
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text
                            bold
                            size={20}
                            style={{ marginBottom: 15, marginLeft: 10 }}
                        >
                            Your top genres
                        </Text>
                        <FlatList
                            data={[
                                { name: 'Rock' },
                                { name: 'Indie' },
                                { name: 'Pop' },
                                { name: 'Metal' }
                            ]}
                            numColumns={2}
                            scrollEnabled={false}
                            keyExtractor={(_, i) => i.toString()}
                            contentContainerStyle={{ marginHorizontal: 10 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        paddingBottom: 20,
                                        position: 'relative'
                                    }}
                                >
                                    <View
                                        style={{
                                            width: width / 2 - 30,
                                            height: (width / 2 - 30) / 2,
                                            backgroundColor: 'blue',
                                            borderRadius: 6
                                        }}
                                    />
                                    <Text
                                        bold
                                        size={16}
                                        style={{
                                            position: 'absolute',
                                            top: 15,
                                            left: 30
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        textAlign: 'center',
        marginBottom: 10
    }
});
