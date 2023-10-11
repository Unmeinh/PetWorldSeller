import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function onNavigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function onGoBack() {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    }
  }