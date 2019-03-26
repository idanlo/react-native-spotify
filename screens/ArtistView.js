import React from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '../UI';
import globalStyles from '../styles';

function ArtistView(props) {
    const [loading, setLoading] = React.useState(true);
    let routeSubscription;

    React.useEffect(() => {
        routeSubscription = props.navigation.addListener(
            'willFocus',
            fetchData
        );
        fetchData();
        return () => {
            routeSubscription.remove();
        };
    });

    fetchData = ctx => {
        setLoading(true);
        let artistId;
        if (ctx) {
            artistId = ctx.state.params.artistId;
        } else {
            artistId = props.navigation.getParam('artistId');
        }
        // fetch data
    };

    return (
        <View style={globalStyles.container}>
            {!loading ? (
                <ScrollView>
                    <Text>Artist</Text>
                </ScrollView>
            ) : (
                <View
                    style={[
                        globalStyles.container,
                        {
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    ]}
                >
                    <ActivityIndicator size="large" color="#1DB954" />
                </View>
            )}
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {

//     }
// })

export default ArtistView;
