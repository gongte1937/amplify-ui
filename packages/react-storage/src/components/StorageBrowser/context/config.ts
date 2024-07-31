import React from 'react';
import { GetLocationCredentials } from '@aws-amplify/storage/storage-browser';

import { _ListLocations } from './actions/listLocationsAction';
import { Permission } from './actions/types';

// TODO: replace during credentials store integration
export interface Config<T = Permission> {
  listLocations: _ListLocations<T>;
  getLocationCredentials: GetLocationCredentials;
  region: string;
}

const USE_CONFIG_ERROR_MESSAGE =
  '`useConfig` must be called within a `ConfigContext.Provider';

export const ConfigContext = React.createContext<Config | undefined>(undefined);

export const useConfig = (): Config => {
  const context = React.useContext(ConfigContext);
  if (!context) {
    throw new Error(USE_CONFIG_ERROR_MESSAGE);
  }
  return context;
};