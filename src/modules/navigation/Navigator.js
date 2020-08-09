import React from 'react';
import AppNavigator from './RootNavigation';
import Modal from '../modal/ModalViewContainer';

export default function NavigatorView() {
  return (
    <>
      <Modal />
      <AppNavigator />
    </>
  );
}
