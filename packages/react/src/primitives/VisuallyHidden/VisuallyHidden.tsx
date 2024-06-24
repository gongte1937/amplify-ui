import * as React from 'react';
import { visuallyHiddenClasses } from '@aws-amplify/ui';

import {
  ForwardRefPrimitive,
  Primitive,
  BaseVisuallyHiddenProps,
  VisuallyHiddenProps,
} from '../types';
import { View } from '../View';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef';

const VisuallyHiddenPrimitive: Primitive<VisuallyHiddenProps, 'span'> = (
  { as = 'span', children, className, ...rest },
  ref
) => (
  <View
    as={as}
    className={visuallyHiddenClasses(undefined, [className])}
    ref={ref}
    {...rest}
  >
    {children}
  </View>
);

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/visuallyhidden)
 */
export const VisuallyHidden: ForwardRefPrimitive<
  BaseVisuallyHiddenProps,
  'span'
> = primitiveWithForwardRef(VisuallyHiddenPrimitive);

VisuallyHidden.displayName = 'VisuallyHidden';
