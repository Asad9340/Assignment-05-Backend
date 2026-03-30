import { envVars } from '../../config/env.config';
import {
  TSSLInitPayload,
  TSSLInitResponse,
  TSSLValidateResponse,
} from './payment.interface';

const isTruthy = (value: string) => {
  return ['true', '1', 'yes'].includes(value.trim().toLowerCase());
};

const getSSLBaseUrl = () => {
  return isTruthy(envVars.SSLCOMMERZ.SSL_IS_LIVE)
    ? 'https://securepay.sslcommerz.com'
    : 'https://sandbox.sslcommerz.com';
};

export const sslCommerzInitPayment = async (
  payload: TSSLInitPayload,
): Promise<TSSLInitResponse> => {
  const url = `${getSSLBaseUrl()}/gwprocess/v4/api.php`;

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  let data: TSSLInitResponse;

  try {
    data = (await response.json()) as TSSLInitResponse;
  } catch {
    const responseText = await response.text();
    data = {
      status: 'FAILED',
      failedreason: responseText || 'Invalid gateway response',
    };
  }

  return data;
};

export const sslCommerzValidatePayment = async (
  valId: string,
): Promise<TSSLValidateResponse> => {
  const url = `${getSSLBaseUrl()}/validator/api/validationserverAPI.php`;

  const queryParams = new URLSearchParams({
    val_id: valId,
    store_id: envVars.SSLCOMMERZ.SSL_STORE_ID,
    store_passwd: envVars.SSLCOMMERZ.SSL_STORE_PASSWORD,
    v: '1',
    format: 'json',
  });

  const response = await fetch(`${url}?${queryParams.toString()}`, {
    method: 'GET',
  });

  const data = (await response.json()) as TSSLValidateResponse;

  return data;
};

export const sslCommerzQueryTransactionByTransactionId = async (
  trxId: string,
): Promise<TSSLValidateResponse> => {
  const url = `${getSSLBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;

  const queryParams = new URLSearchParams({
    tran_id: trxId,
    store_id: envVars.SSLCOMMERZ.SSL_STORE_ID,
    store_passwd: envVars.SSLCOMMERZ.SSL_STORE_PASSWORD,
    v: '1',
    format: 'json',
  });

  const response = await fetch(`${url}?${queryParams.toString()}`, {
    method: 'GET',
  });

  const data = (await response.json()) as TSSLValidateResponse;

  return data;
};
