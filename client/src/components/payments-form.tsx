import { ConfirmCardPaymentData } from '@stripe/stripe-js';
import { CardElement as element } from '@stripe/react-stripe-js';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { useSelector, useStripeIntent, useStripeCard } from '../../app/hooks';
import Form from '../../app/shared/form';
import AgentAutocomplete from '../agents/agent-autocomplete';
import StripeTextField from '../../app/shared/stripe-text-field';
import ButtonProgress from '../../app/shared/button-progress';

const PaymentsForm: React.FC = () => {
  const { record } = useSelector(state => state.agent);
  const { processing } = useSelector(state => state.billing);
  const { card } = useStripeCard(element);

  let paymentData: ConfirmCardPaymentData | undefined;
  if (record && card) {
    paymentData = {
      receipt_email: 'briankiernan9176@gmail.com',
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
    { card, type: 'payment', paymentData },
    intent => console.log(intent)
  );

  return (
    <Box
      width={400}
      mt={3}
      p='16px 24px'
      border='1px solid rgba(224, 224, 224, 1)'
    >
      <Typography variant='h6'>Process Payment</Typography>
      <Form onSubmit={onSubmit}>
        <AgentAutocomplete />
        <StripeTextField margin='normal' element={element} />
        <ButtonProgress
          fullWidth
          loading={processing}
          disabled={processing || !record}
        >
          Pay
        </ButtonProgress>
      </Form>
    </Box>
  );
};

export default PaymentsForm;
