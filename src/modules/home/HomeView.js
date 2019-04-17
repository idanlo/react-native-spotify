import React from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import Spotify from 'rn-spotify-sdk';
import { commonStyles as globalStyles } from '../../styles';
import RecentlyPlayed from './RecentlyPlayed';
import Featured from './Featured';
import TopArtists from './TopArtists';
import NewReleases from './NewReleases';

function Home(props) {
    const [recentlyPlayed, setRecentlyPlayed] = React.useState(null);
    const [featured, setFeatured] = React.useState(null);
    const [topArtists, setTopArtists] = React.useState(null);
    const [newReleases, setNewReleases] = React.useState(null);

    React.useEffect(() => {
        // fetch recently played
        Spotify.sendRequest(
            'v1/me/player/recently-played',
            'GET',
            { limit: 10 },
            true,
        )
            .then(res => {
                console.log('RECENTLY PLAYED', res);
                setRecentlyPlayed(res);
            })
            .catch(err => {
                console.log(err);
            });

        // fetch browse featured
        Spotify.sendRequest(
            'v1/browse/featured-playlists',
            'GET',
            { limit: 10 },
            true,
        )
            .then(res => {
                console.log('FEATURED', res);
                setFeatured(res);
            })
            .catch(err => {
                console.log(err);
            });

        // fetch top artists
        Spotify.sendRequest('v1/me/top/artists', 'GET', { limit: 10 }, true)
            .then(res => {
                console.log('TOP ARTISTS', res);
                setTopArtists(res);
            })
            .catch(err => {
                console.log(err);
            });

        // fetch new releases
        Spotify.sendRequest(
            'v1/browse/new-releases',
            'GET',
            { limit: 10 },
            true,
        )
            .then(res => {
                console.log('NEW RELEASES', res);
                setNewReleases(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <View style={[globalStyles.container, { paddingTop: 0 }]}>
            <StatusBar backgroundColor="transparent" translucent />
            <ScrollView>
                <View style={{ marginTop: StatusBar.currentHeight }}>
                    {recentlyPlayed ? (
                        <RecentlyPlayed
                            items={recentlyPlayed.items}
                            navigation={props.navigation}
                        />
                    ) : null}
                    {featured ? (
                        <Featured
                            featured={featured}
                            navigation={props.navigation}
                        />
                    ) : null}
                    {topArtists ? (
                        <TopArtists
                            items={topArtists.items}
                            navigation={props.navigation}
                        />
                    ) : null}
                    {newReleases ? (
                        <NewReleases
                            items={newReleases.albums.items}
                            navigation={props.navigation}
                        />
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
}

export default Home;
