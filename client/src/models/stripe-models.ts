import { SetupIntent, PaymentIntent } from '@stripe/stripe-js';
import {
  CardElementComponent,
  CardCvcElementComponent,
  CardExpiryElementComponent,
  CardNumberElementComponent,
} from '@stripe/react-stripe-js';

export type StripeElement =
  | CardElementComponent
  | CardCvcElementComponent
  | CardExpiryElementComponent
  | CardNumberElementComponent;

export type StripeSetupIntentStatus =
  | 'canceled'
  | 'processing'
  | 'requires_action'
  | 'requires_confirmation'
  | 'requires_payment_method'
  | 'succeeded';

export type SetupStatus = StripeSetupIntentStatus | 'error';

export type StripePaymentIntentStatus =
  | 'canceled'
  | 'processing'
  | 'requires_action'
  | 'requires_capture'
  | 'requires_confirmation'
  | 'requires_payment_method'
  | 'succeeded';

export type PaymentStatus = StripePaymentIntentStatus | 'error';

export type IntentStatus = PaymentStatus | SetupStatus;

export type Intent = SetupIntent | PaymentIntent;
