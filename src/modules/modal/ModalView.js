import React from 'react';
import {
    View,
    Modal as RNModal,
    ScrollView,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../../components/Text';

export default function Modal(props) {
    return props.options ? (
        <RNModal
            animationType="slide"
            transparent
            visible={props.isOpen}
            onRequestClose={props.hideModal}
        >
            <LinearGradient
                colors={['transparent', 'black']}
                locations={[0.2, 1]}
                style={[
                    styles.linearGradient,
                    {
                        bottom:
                            props.actions && props.actions.length < 6
                                ? props.actions.length * 60
                                : 300,
                    },
                ]}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        source={{
                            uri: props.options.image,
                        }}
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius:
                                props.options.type === 'artist' ? 75 : 0,
                        }}
                    />
                    <Text
                        bold
                        size={18}
                        style={{
                            width: '75%',
                            textAlign: 'center',
                        }}
                    >
                        {props.options.primaryText}
                    </Text>
                    {props.options.secondaryText ? (
                        <Text
                            color="grey"
                            style={{
                                width: '50%',
                                textAlign: 'center',
                            }}
                        >
                            {props.options.secondaryText}
                        </Text>
                    ) : null}
                </View>
            </LinearGradient>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollView,
                    {
                        height: props.actions && props.actions.length * 60,
                    },
                ]}
            >
                <FlatList
                    contentContainerStyle={styles.flatListContainer}
                    data={props.actions}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <TouchableOpacity
                                onPress={() => {
                                    props.hideModal();
                                    item.click();
                                }}
                            >
                                <Text style={styles.listItemText}>
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </ScrollView>
        </RNModal>
    ) : null;
}

const styles = StyleSheet.create({
    linearGradient: {
        height: 220,
        position: 'absolute',
        left: 0,
        right: 0,
    },
    scrollView: {
        maxHeight: 300,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    flatListContainer: {
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    listItem: {
        alignItems: 'center',
        height: 40,
        margin: 10,
    },
    listItemText: {
        fontWeight: 'bold',
        fontSize: 28,
    },
});
