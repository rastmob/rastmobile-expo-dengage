import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { RastmobileExpoDengageViewProps } from './RastmobileExpoDengage.types';

const NativeView: React.ComponentType<RastmobileExpoDengageViewProps> =
  requireNativeViewManager('RastmobileDengage');

export default function RastmobileExpoDengageView(props: RastmobileExpoDengageViewProps) {
  return <NativeView {...props} />;
}
