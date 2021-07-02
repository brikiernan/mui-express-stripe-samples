import axios from 'axios';
import { FormEvent } from 'react';
import {
  StripeError,
  ConfirmCardSetupData,
  ConfirmCardPaymentData,
  StripeCardElement,
} from '@stripe/stripe-js';
import { useStripe } from '@stripe/react-stripe-js';

import { useDialogs, useActions } from '.';
import { SerializedError, StripeSetupIntentStatus, Intent } from '../models';

interface IntentProps {
  type: 'payment' | 'setup';
  card?: StripeCardElement | null;
  id?: string;
  paymentData?: ConfirmCardPaymentData;
  setupData?: ConfirmCardSetupData;
}

type Callback = (intent: Intent) => void;

export const useStripeIntent = (props: IntentProps, callback?: Callback) => {
  const { card, type, id, paymentData, setupData } = props;
  const { setIntentProcessing, resetBillingReducer } = useActions();
  const { openTempToast } = useDialogs();
  const stripe = useStripe();

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const valid = event.currentTarget.reportValidity();

    let intent: Intent | undefined, stripeError: StripeError | undefined;
    try {
      if (!valid) throw Error('Invaild form.');

      if (!stripe) throw Error('No stripe elements.');

      setIntentProcessing({ status: 'processing' });

      type Result = {
        clientSecret: string;
        status: StripeSetupIntentStatus;
      };

      if (type === 'setup') {
        if (!id) throw Error('Customer id required.');

        // prettier-ignore
        const { data: { clientSecret, status } } = await axios.post<Result>(
          '/api/setup-intents', { id }
        );

        setIntentProcessing({ status });

        const res = await stripe.confirmCardSetup(clientSecret, setupData);

        stripeError = res.error;
        intent = res.setupIntent;
      }

      if (type === 'payment') {
        // prettier-ignore
        const { data: { clientSecret, status } } = await axios.post<Result>(
          '/api/payment-intents'
        );

        setIntentProcessing({ status });

        const res = await stripe.confirmCardPayment(clientSecret, paymentData);

        stripeError = res.error;
        intent = res.paymentIntent;
      }

      if (stripeError) {
        const generic = 'There was an unknown problem.';
        const message = stripeError.message || generic;
        openTempToast({ message, severity: 'error', duration: 1000 * 10 });
        setIntentProcessing({ status: 'error' });
        return;
      }

      if (intent) {
        setIntentProcessing({ status: intent.status });

        if (intent.status === 'succeeded') {
          card?.clear();
          openTempToast({ message: 'Payment successful.' });

          if (callback) callback(intent);
        }
        return;
      }
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors as SerializedError[];
        const message = errors[0].message;
        openTempToast({ message, severity: 'error', duration: 1000 * 10 });
        resetBillingReducer();
        return;
      }
      resetBillingReducer();
      console.error(`Unexpected 'use-stripe-intent' error: ${error.message}`);
    }
  };

  return { onSubmit };
};
