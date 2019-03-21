import React from 'react';
import { Text as RNText } from 'react-native';

export function Text({ style, ...props }) {
    console.log(props);
    return <RNText style={{ color: '#fff', ...style }} {...props} />;
}
