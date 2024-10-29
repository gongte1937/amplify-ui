import React from 'react';

import { createContextUtilities } from '@aws-amplify/ui-react-core';
import { noop } from '@aws-amplify/ui';

import { FileData } from '../../../actions/handlers';

export const DEFAULT_STATE: LocationItemsState = {
  fileDataItems: undefined,
};

export type LocationItemsAction =
  | { type: 'SET_LOCATION_ITEMS'; items?: FileData[] }
  | { type: 'REMOVE_LOCATION_ITEM'; id: string }
  | { type: 'RESET_LOCATION_ITEMS' };

export interface LocationItemsState {
  fileDataItems: FileData[] | undefined;
}

export type HandleLocationItemsAction = (event: LocationItemsAction) => void;

export type LocationItemStateContext = [
  LocationItemsState,
  HandleLocationItemsAction,
];

export interface LocationItemsProviderProps {
  children?: React.ReactNode;
}

const locatonItemsReducer = (
  prevState: LocationItemsState,
  event: LocationItemsAction
): LocationItemsState => {
  switch (event.type) {
    case 'SET_LOCATION_ITEMS': {
      const { items } = event;
      if (!items?.length) return prevState;

      if (!prevState.fileDataItems?.length) return { fileDataItems: items };

      const nextFileDataItems = items?.reduce(
        (fileDataItems: FileData[], item) =>
          prevState.fileDataItems?.some(({ id }) => id === item.id)
            ? fileDataItems
            : [...fileDataItems, item],
        []
      );

      if (!nextFileDataItems?.length) return prevState;

      return {
        fileDataItems: [...prevState.fileDataItems, ...nextFileDataItems],
      };
    }
    case 'REMOVE_LOCATION_ITEM': {
      const { id } = event;

      if (!prevState.fileDataItems) return prevState;

      const fileDataItems = prevState.fileDataItems.filter(
        (item) => item.id !== id
      );

      if (fileDataItems.length === prevState.fileDataItems.length) {
        return prevState;
      }

      return { fileDataItems };
    }
    case 'RESET_LOCATION_ITEMS': {
      return DEFAULT_STATE;
    }
  }
};

const defaultValue: LocationItemStateContext = [DEFAULT_STATE, noop];
export const { LocationItemsContext, useLocationItems } =
  createContextUtilities({
    contextName: 'LocationItems',
    defaultValue,
  });

export function LocationItemsProvider({
  children,
}: LocationItemsProviderProps): React.JSX.Element {
  const value = React.useReducer(locatonItemsReducer, DEFAULT_STATE);

  return (
    <LocationItemsContext.Provider value={value}>
      {children}
    </LocationItemsContext.Provider>
  );
}