import React from 'react';
import { Text } from '../UI';

function ArtistView(props) {
    return <Text>{props.navigation.getParam('artistId')}</Text>;
}

export default ArtistView;
