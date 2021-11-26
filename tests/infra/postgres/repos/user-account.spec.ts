import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';
import { PgUserAccountRepository } from '@/infra/postgres/repos';
import { makeFakeDb } from '../mocks';

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository();
  });

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' });

      const account = await sut.load({
        email: 'existing_email',
      });

      expect(account).toEqual({ id: '1' });
    });

    it('should return undefined if email not exists', async () => {
      const account = await sut.load({
        email: 'new_email',
      });

      expect(account).toBe(undefined);
    });
  });

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const email = 'any_email';
      await sut.saveWithFacebook({
        email,
        name: 'any_name',
        facebook_id: 'any_fb_id',
      });

      const pgUser = await pgUserRepo.findOne({ email });

      expect(pgUser?.id).toBe(1);
    });
  });
});
