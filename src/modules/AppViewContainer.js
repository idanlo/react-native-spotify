import {compose, lifecycle} from 'recompose';
import {Platform, UIManager} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';

import AppView from './AppView';

export default compose(
  lifecycle({
    componentWillMount() {
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    },
  }),
)(AppView);
