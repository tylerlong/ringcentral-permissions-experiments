import RingCentral from '@rc-ex/core';
import RestException from '@rc-ex/core/RestException';

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

    // admin create contact for standard user
    const contact = await rc1
      .restapi()
      .account()
      .extension(ext2.id?.toString())
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
      .extension(ext2.id?.toString())
      .addressBook()
      .contact(contact.id?.toString())
      .delete();

    // standard user create contact for another user
    let exception: RestException | undefined = undefined;
    try {
      await rc2
        .restapi()
        .account()
        .extension(ext1.id?.toString())
        .addressBook()
        .contact()
        .post({
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email@sample.com',
        });
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeDefined();
    expect(exception!.message.includes('CMN-419'));
    expect(
      exception!.message.includes(
        'user needs to have [EditPersonalContacts] permission granted with extended scope'
      )
    );

    await rc1.revoke();
    await rc2.revoke();
  });
});
