import RingCentral from '@rc-ex/core';

jest.setTimeout(128000);

describe('create contact', () => {
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

    const contact = await rc1
      .restapi()
      .account()
      .extension()
      .addressBook()
      .contact()
      .post({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email@sample.com',
      });

    // delete it after testing
    await rc1
      .restapi()
      .account()
      .extension()
      .addressBook()
      .contact(contact.id?.toString())
      .delete();

    await rc1.revoke();
    await rc2.revoke();
  });
});
