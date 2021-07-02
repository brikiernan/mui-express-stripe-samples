import { useEffect, useState } from 'react';
import { useElements, CardElementComponent } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

export const useStripeCard = (cardElement: CardElementComponent) => {
  const [card, setCard] = useState<StripeCardElement | null>(null);
  const elements = useElements();

  useEffect(() => {
    if (!elements) return;

    setCard(elements.getElement(cardElement));

    return () => card?.unmount();
  }, [elements, cardElement]);

  return { card };
};
