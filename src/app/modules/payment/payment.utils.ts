import { envVars } from '../../config/env.config';
import {
  TSSLInitPayload,
  TSSLInitResponse,
  TSSLValidateResponse,
} from './payment.interface';

const getSSLBaseUrl = () => {
  return envVars.SSLCOMMERZ.SSL_IS_LIVE
    ? 'https://securepay.sslcommerz.com'
    : 'https://sandbox.sslcommerz.com';
};

export const sslCommerzInitPayment = async (
  payload: TSSLInitPayload,
): Promise<TSSLInitResponse> => {
  const url = `${getSSLBaseUrl()}/gwprocess/v4/api.php`;

  const formBody = new URLSearchParams(
    Object.entries(payload).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });

  const data = (await response.json()) as TSSLInitResponse;

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
