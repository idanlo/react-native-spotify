import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../login/LoginViewContainer';

const switchNavigator = createSwitchNavigator(
    {
        Login: {
            screen: LoginScreen,
        },
        Main: MainTabNavigator,
    },
    {
        initialRouteName: 'Login',
    },
);

export default createAppContainer(switchNavigator);
