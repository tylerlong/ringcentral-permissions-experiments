import RingCentral from '@rc-ex/core';
import RestException from '@rc-ex/core/RestException';

jest.setTimeout(128000);

describe('send message on behalf of others', () => {
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
    const pn1 = (
      await rc1.restapi().account().extension().phoneNumber().get()
    ).records!.filter(pn => pn.features!.includes('SmsSender'))[0].phoneNumber!;

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
    const pn2 = (
      await rc2.restapi().account().extension().phoneNumber().get()
    ).records!.filter(pn => pn.features!.includes('SmsSender'))[0].phoneNumber!;

    // admin send sms on behalf of a standard user
    let exception1: RestException | undefined = undefined;
    try {
      await rc1
        .restapi()
        .account()
        .extension()
        .sms()
        .post({
          from: {phoneNumber: pn2},
          to: [
            {
              phoneNumber: process.env.RINGCENTRAL_RECEIVER!,
            },
          ],
          text: 'Hello world',
        });
    } catch (e) {
      exception1 = e;
    }
    expect(exception1).toBeDefined();
    expect(
      exception1?.message.includes("Phone number doesn't belong to extension")
    ).toBeTruthy();

    // an standard user send sms on behalf of a super admin
    let exception2: RestException | undefined = undefined;
    try {
      await rc2
        .restapi()
        .account()
        .extension()
        .sms()
        .post({
          from: {phoneNumber: pn1},
          to: [
            {
              phoneNumber: process.env.RINGCENTRAL_RECEIVER!,
            },
          ],
          text: 'Hello world',
        });
    } catch (e) {
      exception2 = e;
    }
    expect(exception2).toBeDefined();
    expect(
      exception2?.message.includes("Phone number doesn't belong to extension")
    ).toBeTruthy();

    await rc1.revoke();
    await rc2.revoke();
  });
});
