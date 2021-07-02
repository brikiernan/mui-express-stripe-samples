import { forwardRef } from 'react';
import { StripeElementChangeEvent as StripeEvent } from '@stripe/stripe-js';
import { TextFieldProps } from '@material-ui/core/TextField';

import { useActions, useSelector } from '../hooks';
import { StripeInput } from './stripe-input';
import { StripeElement, VariableWidths } from '../models';
import VariableWidthInput from './variable-width-input';

type StripeTextFieldProps = TextFieldProps & {
  element: StripeElement;
  fieldSize?: VariableWidths;
};

const StripeTextField = forwardRef(
  ({ element, fieldSize, ...rest }: StripeTextFieldProps, ref) => {
    const { error, hasErrors } = useSelector(state => state.billing);
    const { setElementError } = useActions();

    const onChange = (event: unknown) => setElementError(event as StripeEvent);

    return (
      <VariableWidthInput
        inputRef={ref}
        error={hasErrors}
        helperText={error?.message}
        onChange={onChange}
        fieldSize={fieldSize}
        InputProps={{
          inputProps: { component: element },
          inputComponent: StripeInput,
        }}
        {...rest}
      />
    );
  }
);

export default StripeTextField;
