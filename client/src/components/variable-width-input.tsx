import { forwardRef } from 'react';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { VariableWidths } from '../models';

const useStyles = makeStyles(() => ({
  full: {
    width: '98%',
    margin: '12px 1%',
  },
  half: {
    width: '48%',
    margin: '12px 1%',
  },
  quarter: {
    width: '23%',
    margin: '12px 1%',
  },
  oneThird: {
    width: '31.33%',
    margin: '12px 1%',
  },
  twoThirds: {
    width: '64.66%',
    margin: '12px 1%',
  },
}));

type OtherProps = TextFieldProps & {
  fieldSize?: VariableWidths;
};

const VariableWidthInput = forwardRef(
  ({ fieldSize, ...rest }: OtherProps, ref) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    return (
      <TextField
        inputRef={ref}
        className={matches && fieldSize ? classes[fieldSize] : undefined}
        {...rest}
      />
    );
  }
);

export default VariableWidthInput;
