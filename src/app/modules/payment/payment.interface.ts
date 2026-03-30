export interface TInitiatePaymentPayload {
  eventId: string;
}

export interface TSSLInitPayload {
  store_id: string;
  store_passwd: string;
  productcategory: string;
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_add2: string;
  cus_city: string;
  cus_state: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  num_of_item: number;
  ship_name: string;
  ship_add1: string;
  ship_add2: string;
  ship_city: string;
  ship_state: string;
  ship_postcode: string;
  ship_country: string;
}

export interface TSSLInitResponse {
  status: string;
  failedreason?: string;
  sessionkey?: string;
  GatewayPageURL?: string;
  gatewayPageURL?: string;
  storeBanner?: string;
  storeLogo?: string;
}

export interface TSSLValidateResponse {
  status?: string;
  tran_date?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  bank_tran_id?: string;
  card_type?: string;
  currency?: string;
  card_no?: string;
  card_issuer?: string;
  card_brand?: string;
  card_issuer_country?: string;
  card_issuer_country_code?: string;
  currency_type?: string;
  currency_amount?: string;
  verify_sign?: string;
  verify_key?: string;
  risk_level?: string;
  risk_title?: string;
  APIConnect?: string;
  validated_on?: string;
  gw_version?: string;
}
