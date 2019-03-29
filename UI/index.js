import React from 'react';
import { Text as RNText } from 'react-native';

export function Text({ style, color, size, bold, ...props }) {
    return (
        <RNText
            style={[
                style,
                {
                    color: color ? color : '#fff',
                    fontSize: size ? size : 14,
                    fontWeight: bold ? 'bold' : 'normal'
                }
            ]}
            {...props}
        />
    );
}
