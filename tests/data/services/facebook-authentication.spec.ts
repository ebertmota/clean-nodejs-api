import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/contracts/repos';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>;

  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>({
      loadUser: jest.fn(() =>
        Promise.resolve({
          name: 'any_fb_name',
          email: 'any_fb_email',
          facebook_id: 'any_fb_id',
        }),
      ),
    });
    createFacebookAccountRepo = mock();
    loadUserAccountRepo = mock();
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo,
    );
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({
      token,
    });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({
      token,
    });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({
      token,
    });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({
      token,
    });

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_id',
    });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(
      1,
    );
  });
});
