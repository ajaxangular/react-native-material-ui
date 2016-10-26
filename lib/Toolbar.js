import {
    findNodeHandle,
    NativeModules,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    Image
} from 'react-native';
import { getColor } from './helpers';
import { TYPO, PRIMARY, THEME_NAME, PRIMARY_COLORS } from './config';
import Icon from './Icon';
import IconToggle from './IconToggle';
import Avatar from './Avatar';
import isFunction from './utils';
import React, { Component, PropTypes } from 'react';

const UIManager = NativeModules.UIManager;

const styles = StyleSheet.create({
    toolbar: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        marginLeft: 16,
    },
    leftIcon: {
        borderWidth: 0,
        marginRight: 16,
        marginLeft: 16
    },
    rightIcon: {
        margin: 16,
    },
});

export default class Toolbar extends Component {

    static propTypes = {
        title: PropTypes.string,
        onTitlePress: PropTypes.func,
        theme: PropTypes.oneOf(THEME_NAME),
        primary: PropTypes.oneOf(PRIMARY_COLORS),
        style: View.propTypes.style,
        leftIconStyle: PropTypes.object,
        rightIconStyle: PropTypes.object,
        elevation: PropTypes.number,
        overrides: PropTypes.shape({
            backgroundColor: PropTypes.string,
            titleColor: PropTypes.string,
            leftIconColor: PropTypes.string,
            rightIconColor: PropTypes.string,
        }),
        icon: PropTypes.string,
        imgLogo: PropTypes.any,
        onIconPress: PropTypes.func,
        actions: PropTypes.arrayOf(PropTypes.shape({
            icon: PropTypes.string.isRequired,
            onPress: PropTypes.func,
        })),
        menuActions: PropTypes.shape({
            onPress: PropTypes.func,
            labels: PropTypes.array,
        }),
        searchable: PropTypes.shape({
            onChangeText: PropTypes.func,
            onSearchClosed: PropTypes.func,
            placeholder: PropTypes.string,
            onSearchPressed: PropTypes.func,
            onSubmitEditing: PropTypes.func,
            autoFocus: PropTypes.bool,
        }),
        isSearchActive: PropTypes.bool,
        isChild: PropTypes.bool
    };

    static defaultProps = {
        theme: 'dark',
        primary: PRIMARY,
        elevation: 4,
        isChild: false
    };

    constructor(props) {
        super(props);

        this.state = {
            isSearchActive: props.isSearchActive,
            searchValue: '',
        };
    }
    onMenuPressed = () => {
        const { menuActions } = this.props;

        UIManager.showPopupMenu(
            findNodeHandle(this.refs.menu),
            menuActions.labels,
            () => {},
            menuActions.onPress
        );
    };
    onSearchTextChanged = (value) => {
        const { searchable } = this.props;

        if (isFunction(searchable.onChangeText)) {
            searchable.onChangeText(value);
        }

        this.setState({ searchValue: value });
    };
    onSearchPressed = () => {
        const { searchable } = this.props;

        if (isFunction(searchable.onSearchPressed)) {
            searchable.onSearchPressed();
        }

        this.setState({
            isSearchActive: true,
            searchValue: '',
        });
    };
    onSearchClosePressed = () => {
        const { searchable } = this.props;

        if (isFunction(searchable.onSearchClosed)) {
            searchable.onSearchClosed();
        }

        this.setState({
            isSearchActive: false,
            searchValue: '',
        });
    };


    focusSearchField() {
        this.searchFieldRef.focus();
    }

    render() {
        const {
            title,
            onTitlePress,
            theme,
            primary,
            style,
            leftIconStyle,
            rightIconStyle,
            elevation,
            overrides,
            icon,
            onIconPress,
            actions,
            menuActions,
            searchable,
            isChild,
            imgLogo
        } = this.props;

        const themeMap = {
            light: {
                backgroundColor: '#ffffff',
                color: 'rgba(0,0,0,.87)',
                leftIconColor: 'rgba(0,0,0,.54)',
                rightIconColor: 'rgba(0,0,0,.54)',
            },
            dark: {
                backgroundColor: getColor(primary),
                color: 'rgba(255,255,255,.87)',
                leftIconColor: 'rgba(255,255,255,.87)',
                rightIconColor: 'rgba(255,255,255,.87)',
            },
        };

        const opacityMap = {
            light: .38,
            dark: .30,
        };

        // TODO: refactor this
        const styleMap = {
            backgroundColor: overrides && overrides.backgroundColor ?
                                getColor(overrides.backgroundColor) :
                                themeMap[theme].backgroundColor,
            color: overrides && overrides.color ?
                        getColor(overrides.color) :
                        themeMap[theme].color,
            leftIconColor: overrides && overrides.leftIconColor ?
                                getColor(overrides.leftIconColor) :
                                themeMap[theme].leftIconColor,
            rightIconColor: overrides && overrides.rightIconColor ?
                                getColor(overrides.rightIconColor) :
                                themeMap[theme].rightIconColor,
        };

        let iconMap = icon;
        let onIconPressMap = onIconPress;
        let actionsMap = actions;
        let menuActionsMap = menuActions;

        if (this.state.isSearchActive) {
            iconMap = 'arrow-back';
            onIconPressMap = this.onSearchClosePressed;
            styleMap.backgroundColor = getColor('paperGrey100');
            styleMap.color = themeMap.light.color;
            styleMap.leftIconColor = themeMap.light.leftIconColor;
            styleMap.rightIconColor = themeMap.light.rightIconColor;
            actionsMap = [{
                icon: 'clear',
                onPress: () => this.onSearchTextChanged(''),
            }];
            menuActionsMap = null;
        }

        return (
            <View
                style={[
                    styles.toolbar,
                  { backgroundColor: styleMap.backgroundColor, elevation, flex: 1, borderWidth: 0 },
                    style,
                ]}
            >
                {
                    iconMap && (
                        <IconToggle
                            color={styleMap.leftIconColor}
                            onPress={onIconPressMap}
                        >
                            <Icon
                                name={iconMap || 'menu'}
                                size={24}
                                color={styleMap.leftIconColor}
                                style={[styles.leftIcon, leftIconStyle]}
                            />
                        </IconToggle>
                    )
                }
                {
                    !this.state.isSearchActive &&
                        <View style={{flex: 1, marginRight: 16, alignItems: isChild ? 'flex-start' : 'flex-start', justifyContent: 'flex-end', borderWidth: 0}}>
                            <TouchableWithoutFeedback onPress={onTitlePress}>
                                <View style={{flexDirection: 'row', marginLeft: 5}}>
                                    <View style={{justifyContent: 'center'}}>

                                        <Avatar
                                            size={40}
                                            borderRadius={40}
                                            borderColor={'white'}
                                            image={<Image source={imgLogo} />}
                                            />
                                    </View>
                                    <View style={{justifyContent: 'center'}}>
                                        <Text style={{fontSize: 16, color: 'black', borderWidth: 0}}>
                                            {title}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                }
                {
                    this.state.isSearchActive &&
                        <TextInput
                            ref={(ref) => { this.searchFieldRef = ref; }}
                            autoFocus={searchable.autoFocus}
                            onChangeText={this.onSearchTextChanged}
                            onSubmitEditing={searchable.onSubmitEditing}
                            placeholder={searchable.placeholder}
                            style={[styles.title, TYPO.paperFontTitle, {
                                fontWeight: 'normal',
                                color: styleMap.color,
                                marginLeft: iconMap ? styles.title.marginLeft : 16,
                            }]}
                            underlineColorAndroid="transparent"
                            value={this.state.searchValue}
                        />
                }
                {
                    actionsMap &&
                    actionsMap.map((action, i) => (
                        <IconToggle
                            key={i}
                            color={styleMap.rightIconColor}
                            badge={action.badge}
                            onPress={action.onPress}
                            disabled={action.disabled}
                        >
                            <Icon
                                name={action.icon}
                                size={24}
                                color={styleMap.rightIconColor}
                                style={[
                                    styles.rightIcon,
                                    rightIconStyle,
                                    action.disabled ? { opacity: opacityMap[theme] } : null,
                                ]}
                            />
                        </IconToggle>
                        )
                    )
                }
                {
                    searchable && !this.state.isSearchActive &&
                        <IconToggle
                            color={styleMap.rightIconColor}
                            onPress={this.onSearchPressed}
                        >
                            <Icon
                                name={'search'}
                                color={styleMap.rightIconColor}
                                size={24}
                                style={[styles.rightIcon, rightIconStyle]}
                            />
                        </IconToggle>
                }
                {
                    menuActionsMap &&
                        <IconToggle
                            color={styleMap.rightIconColor}
                            onPress={this.onMenuPressed}
                        >
                            <Icon
                                name={'more-vert'}
                                color={styleMap.rightIconColor}
                                ref="menu"
                                size={24}
                                style={[styles.rightIcon, rightIconStyle]}
                            />
                        </IconToggle>
                }
            </View>
        );
    }

}
