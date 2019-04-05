/* eslint-disable import/no-unresolved */
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import { colors } from '../../styles';

import HomeScreen from '../home/HomeViewContainer';
import SearchScreen from '../search/SearchViewContainer';
import LibraryScreen from '../library/LibraryViewContainer';
import PlayerScreen from '../player/PlayerViewContainer';
import AlbumScreen from '../album/AlbumViewContainer';
import PlaylistScreen from '../playlist/PlaylistViewContainer';
import ArtistScreen from '../artist/ArtistViewContainer';

import Player from '../player/Player';

const HomeNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="md-home" size={30} color={tintColor} />
                ),
            },
        },
        Search: {
            screen: SearchScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-search" size={30} color={tintColor} />
                ),
            },
        },
        Library: {
            screen: LibraryScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-apps" size={30} color={tintColor} />
                ),
            },
        },
        PlayerView: {
            screen: PlayerScreen,
            navigationOptions: {
                tabBarButtonComponent: () => null,
                tabBarVisible: false,
            },
        },
        AlbumView: {
            screen: AlbumScreen,
            navigationOptions: {
                tabBarButtonComponent: () => null,
            },
        },

        PlaylistView: {
            screen: PlaylistScreen,
            navigationOptions: {
                tabBarButtonComponent: () => null,
            },
        },
        ArtistView: {
            screen: ArtistScreen,
            navigationOptions: {
                tabBarButtonComponent: () => null,
            },
        },
    },
    {
        initialRouteName: 'Home',
        tabBarOptions: {
            activeTintColor: colors.primaryLight,
            showIcon: true,
            style: { backgroundColor: colors.primaryDark },
        },
        backBehavior: 'history',
        tabBarComponent: props => (
            <View>
                <Player navigation={props.navigation} />
                <BottomTabBar {...props} />
            </View>
        ),
    },
);

export default HomeNavigator;
