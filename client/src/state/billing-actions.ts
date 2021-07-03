import { StripeElementChangeEvent, StripeError } from '@stripe/stripe-js';

import { ActionType } from '../action-types';
import { IntentStatus } from '../../models';

export const setElementError = (payload: StripeElementChangeEvent) => {
  return {
    type: ActionType.SET_ELEMENT_ERROR,
    payload,
  };
};

export const setIntentProcessing = (payload: {
  status: IntentStatus;
  error?: StripeError;
}) => {
  return {
    type: ActionType.SET_INTENT_PROCESSING,
    payload,
  };
};

export const resetBillingReducer = () => {
  return {
    type: ActionType.RESET_BILLING_REDUCER,
  };
};
