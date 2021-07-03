import produce from 'immer';
import { ActionType } from '../action-types';
import { BillingActions } from '../actions';
import { PaymentStatus, BillingError } from '../../models';

interface BillingState {
  error: BillingError | null;
  hasErrors: boolean;
  processing: boolean;
  status: PaymentStatus | null;
}

const initialBilling: BillingState = {
  error: null,
  hasErrors: false,
  processing: false,
  status: null,
};

const reducer = (
  state: BillingState = initialBilling,
  action: BillingActions
): BillingState => {
  switch (action.type) {
    case ActionType.SET_ELEMENT_ERROR: {
      const { payload } = action;

      if (payload.error) {
        state.hasErrors = true;
        state.status = 'error';
        state.error = {
          type: payload.elementType,
          message: payload.error.message,
        };
        return state;
      }

      state.hasErrors = false;
      state.status = null;
      state.error = null;

      return state;
    }

    case ActionType.SET_INTENT_PROCESSING: {
      const { payload } = action;
      const error = payload.status === 'error';
      const canceled = payload.status === 'canceled';
      const succeeded = payload.status === 'succeeded';

      if (error && payload.error) {
        state.hasErrors = true;
        state.processing = false;
        state.status = payload.status;
        state.error = {
          message: payload.error.message || 'Stripe payment error.',
          type: payload.error.type,
        };
        return state;
      }

      if (error) {
        state.hasErrors = true;
        state.processing = false;
        state.status = payload.status;
        return state;
      }

      if (canceled || succeeded) {
        state.hasErrors = false;
        state.processing = false;
        state.status = payload.status;
        return state;
      }

      state.hasErrors = false;
      state.processing = true;
      state.status = payload.status;
      return state;
    }

    case ActionType.RESET_BILLING_REDUCER: {
      state = initialBilling;
      return state;
    }

    default:
      return state;
  }
};

export default produce(reducer, initialBilling);
