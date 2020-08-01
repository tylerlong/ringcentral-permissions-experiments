/* eslint-disable node/no-unpublished-import */
/* eslint-env jest */
import RingCentral from '@rc-ex/core';
import RestException from '@rc-ex/core/RestException';

jest.setTimeout(128000);

describe('read message store', () => {
  test('default', async () => {
    // super admin
    const rc1 = new RingCentral({
      clientId: process.env.RINGCENTRAL_CLIENT_ID!,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
      server: process.env.RINGCENTRAL_SERVER_URL!,
    });
    await rc1.authorize({
      username: process.env.RINGCENTRAL_USERNAME!,
      extension: process.env.RINGCENTRAL_EXTENSION_1!,
      password: process.env.RINGCENTRAL_PASSWORD_1!,
    });
    const ext1 = await rc1.restapi().account().extension().get();

    // standard user
    const rc2 = new RingCentral({
      clientId: process.env.RINGCENTRAL_CLIENT_ID!,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
      server: process.env.RINGCENTRAL_SERVER_URL!,
    });
    await rc2.authorize({
      username: process.env.RINGCENTRAL_USERNAME!,
      extension: process.env.RINGCENTRAL_EXTENSION_2!,
      password: process.env.RINGCENTRAL_PASSWORD_2!,
    });
    const ext2 = await rc2.restapi().account().extension().get();

    let r = await rc1
      .restapi()
      .account()
      .extension(ext1.id!.toString())
      .messageStore()
      .list();
    expect(r.records?.length).toBeGreaterThan(0);
    r = await rc2
      .restapi()
      .account()
      .extension(ext2.id!.toString())
      .messageStore()
      .list();
    expect(r.records?.length).toBeGreaterThan(0);

    // admin read other's message store
    r = await rc1
      .restapi()
      .account()
      .extension(ext2.id!.toString())
      .messageStore()
      .list();
    expect(r.records?.length).toBeGreaterThan(0);
    r = await rc1
      .restapi()
      .account()
      .extension(ext2.id!.toString())
      .messageStore(r.records![0].id!.toString())
      .get();

    let exception: RestException | undefined = undefined;
    try {
      r = await rc2
        .restapi()
        .account()
        .extension(ext1.id!.toString())
        .messageStore()
        .list();
      expect(r.records?.length).toBeGreaterThan(0);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeDefined();
    expect(exception!.message.includes('CMN-419'));
    expect(
      exception!.message.includes(
        'user needs to have [ReadMessages] permission granted with extended scope'
      )
    );

    await rc1.revoke();
    await rc2.revoke();
  });
});
