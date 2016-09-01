import { getColor } from './helpers';
import { StyleSheet, View, Text } from 'react-native';
import { TYPO, THEME_NAME } from './config';
import React, { Component, PropTypes } from 'react';

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: TYPO.paperFontBody1,
});

export default class Subheader extends Component {

    static propTypes = {
        text: PropTypes.string.isRequired,
        color: PropTypes.string,
        inset: PropTypes.bool,
        theme: PropTypes.oneOf(THEME_NAME),
        lines: PropTypes.number,
        style: PropTypes.object,
    };

    static defaultProps = {
        color: 'rgba(0,0,0,.54)',
        inset: false,
        theme: 'light',
        lines: 1,
    };

    render() {
        const { text, color, inset, lines, style } = this.props;

        return (
            <View
                style={[styles.container, {
                    paddingLeft: inset ? 72 : 16,
                }, style]}
            >
                <Text
                    numberOfLines={lines}
                    style={[styles.text, {
                        color: getColor(color),
                        fontWeight: '500',
                    }]}
                >
                    {text}
                </Text>
            </View>
        );
    }
}
