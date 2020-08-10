import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import Text from '../../components/Text';

export default function Album(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <Image source={{uri: props.image}} style={props.imageStyle} />
      <Text
        numberOfLines={1}
        bold
        size={14}
        style={{textAlign: 'center', width: props.imageStyle.width}}>
        {props.primaryText}
      </Text>
      <Text
        numberOfLines={1}
        size={12}
        color="grey"
        style={{textAlign: 'center', width: props.imageStyle.width}}>
        {props.secondaryText}
      </Text>
    </TouchableOpacity>
  );
}
