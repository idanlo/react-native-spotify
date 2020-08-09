import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from './Text';

function Song(props) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 10,
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity onPress={props.onPress} style={{flex: 10}}>
        <View
          // only use 'flex-direction: row' for items with image
          style={{
            flexDirection: props.image ? 'row' : null,
            alignItems: props.image ? 'center' : null,
          }}>
          {props.image ? (
            <Image
              source={{uri: props.image}}
              style={{
                width: 40,
                height: 40,
                borderRadius: props.artist ? 20 : 0,
                marginRight: 10,
              }}
            />
          ) : null}
          <View style={{flexDirection: 'column'}}>
            <Text numberOfLines={1} color={props.color || '#fff'}>
              {props.text ? props.text : props.song.name}
            </Text>
            {props.artists &&
            props.artists.length > 0 &&
            !props.secondaryText ? (
              <Text numberOfLines={1} size={13} color="grey">
                {props.artists.map((artist) => artist.name).join(', ')}
              </Text>
            ) : null}
            {props.secondaryText ? (
              <Text numberOfLines={1} size={13} color="grey">
                {props.secondaryText}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={props.onOpenModal}
        style={{flex: 1, alignItems: 'flex-end'}}>
        <Icon name="ios-ellipsis-horizontal" color="#fff" size={30} />
      </TouchableOpacity>
    </View>
  );
}

Song.propTypes = {
  song: PropTypes.shape({name: PropTypes.string.isRequired}).isRequired,
  onOpenModal: PropTypes.func,
  onPress: PropTypes.func,
  secondaryText: PropTypes.string,
  image: PropTypes.string,
  artists: PropTypes.arrayOf(
    PropTypes.shape({name: PropTypes.string.isRequired}),
  ),
  text: PropTypes.string,
};

export default Song;
