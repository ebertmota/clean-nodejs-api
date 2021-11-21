export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params,
  ) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result =
    | undefined
    | {
        id: string;
        name?: string;
      };
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (
    params: SaveFacebookAccountRepository.Params,
  ) => Promise<SaveFacebookAccountRepository.Result>;
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string;
    facebook_id: string;
    email: string;
    name: string;
  };

  export type Result = void;
}
