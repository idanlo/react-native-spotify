import React from 'react';
import { Text as RNText } from 'react-native';

export default function Text({ style, color, size, bold, ...props }) {
    return (
        <RNText
            style={[
                {
                    color: color ? color : '#fff',
                    fontSize: size ? size : 14,
                    fontWeight: bold ? 'bold' : 'normal',
                },
                style,
            ]}
            {...props}
        />
    );
}
