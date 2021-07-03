interface SetElementErrorAction {
  type: ActionType.SET_ELEMENT_ERROR;
  payload: StripeElementChangeEvent;
}

interface SetIntentProcessingAction {
  type: ActionType.SET_INTENT_PROCESSING;
  payload: { status: IntentStatus; error?: StripeError };
}

interface ResetBillingReducerAction {
  type: ActionType.RESET_BILLING_REDUCER;
}

export type BillingActions =
  | SetElementErrorAction
  | SetIntentProcessingAction
  | ResetBillingReducerAction;
