import * as React from 'react';
import { iconClasses } from '@aws-amplify/ui';

import { InternalIcon } from './types';
import { View } from '../../View';

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
export const IconIndeterminate: InternalIcon = (props) => {
  const { className, ...rest } = props;

  return (
    <View
      as="span"
      width="1em"
      height="1em"
      className={iconClasses(undefined, [className])}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        width="24"
        viewBox="0 0 24 24"
      >
        <line
          x1="4"
          x2="20"
          y1="12"
          y2="12"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
    </View>
  );
};
