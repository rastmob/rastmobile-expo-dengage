import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to RastmobileExpoDengage.web.ts
// and on native platforms to RastmobileExpoDengage.ts
import RastmobileExpoDengageModule from './RastmobileExpoDengageModule';
import RastmobileExpoDengageView from './RastmobileExpoDengageView';
import { ChangeEventPayload, RastmobileExpoDengageViewProps } from './RastmobileExpoDengage.types';

// Get the native constant value.
export const PI = RastmobileExpoDengageModule.PI;

export function hello(): string {
  return RastmobileExpoDengageModule.hello();
}

export async function setValueAsync(value: string) {
  return await RastmobileExpoDengageModule.setValueAsync(value);
}

const emitter = new EventEmitter(RastmobileExpoDengageModule ?? NativeModulesProxy.RastmobileDengage);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { RastmobileExpoDengageView, RastmobileExpoDengageViewProps, ChangeEventPayload };
