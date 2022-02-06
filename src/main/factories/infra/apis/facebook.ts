import { FacebookApi } from '@/infra/apis';
import { env } from '@/main/config';
import { makeAxiosHttpClient } from '@/main/factories';

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(
    makeAxiosHttpClient(),
    env.facebookApi.clientId,
    env.facebookApi.clientSecret,
  );
};
