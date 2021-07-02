import axios from 'axios';
import Stripe from 'stripe';
import { ConfirmCardSetupData } from '@stripe/stripe-js';
import { CardElement as element } from '@stripe/react-stripe-js';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {
  useSelector,
  useStripeIntent,
  useStripeCard,
  useDialogs,
} from '../../app/hooks';
import { AgentUpdateRequest } from '../../app/models';
import Form from '../../app/shared/form';
import AgentAutocomplete from '../agents/agent-autocomplete';
import StripeTextField from '../../app/shared/stripe-text-field';
import ButtonProgress from '../../app/shared/button-progress';

const PaymentMethodForm: React.FC = () => {
  const { processing } = useSelector(state => state.billing);
  const { record } = useSelector(state => state.agent);
  const { card } = useStripeCard(element);
  const { openTempToast } = useDialogs();

  let setupData: ConfirmCardSetupData | undefined;
  let id = '';
  if (record && card) {
    id = record.stripeID;
    console.log({ card });
    setupData = {
      payment_method: {
        card,
        billing_details: {
          email: record.profile.email,
          phone: record.profile.mobile,
          name: record.profile.first + ' ' + record.profile.last,
          address: {
            line1: record.profile.address,
            city: record.profile.city,
            state: record.profile.state,
            postal_code: record.profile.zip,
          },
        },
      },
    };
  }

  const { onSubmit } = useStripeIntent(
    { card, type: 'setup', setupData, id },
    async intent => {
      const paymentMethod = intent.payment_method;

      if (paymentMethod && record) {
        const agtentsParams: AgentUpdateRequest = {
          stripePM: paymentMethod,
        };

        const customersParams: Stripe.CustomerUpdateParams = {
          invoice_settings: {
            default_payment_method: paymentMethod,
          },
        };

        const all = await Promise.all([
          axios.put(`/api/agents/${record.id}`, agtentsParams),
          axios.put(`/api/customers/${record.stripeID}`, customersParams),
        ]);

        openTempToast({ message: all[0].data.message });
      }
    }
  );

  return (
    <Box
      width={400}
      mt={3}
      p='16px 24px'
      border='1px solid rgba(224, 224, 224, 1)'
    >
      <Typography variant='h6'>Add Agent Payment Method</Typography>
      <Form onSubmit={onSubmit}>
        <AgentAutocomplete />
        <StripeTextField margin='normal' element={element} />
        <ButtonProgress
          fullWidth
          loading={processing}
          disabled={processing || !record}
        >
          Add Card
        </ButtonProgress>
      </Form>
    </Box>
  );
};

export default PaymentMethodForm;
