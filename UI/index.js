import React from 'react';
import { Text as RNText } from 'react-native';

export function Text({ style, color, ...props }) {
    return (
        <RNText style={[style, { color: color ? color : '#fff' }]} {...props} />
    );
}
