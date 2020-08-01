/* eslint-disable node/no-unpublished-import */
/* eslint-env jest */
import RingCentral from '@rc-ex/core';
import PubNubExtension from '@rc-ex/pubnub';
import waitFor from 'wait-for-async';

jest.setTimeout(128000);

describe('monitor incoming SMS', () => {
  test('as super admin', async () => {
    // super admin
    const rc1 = new RingCentral({
      clientId: process.env.RINGCENTRAL_CLIENT_ID!,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
      server: process.env.RINGCENTRAL_SERVER_URL!,
    });
    const pubNubExtension1 = new PubNubExtension();
    rc1.installExtension(pubNubExtension1);
    await rc1.authorize({
      username: process.env.RINGCENTRAL_USERNAME!,
      extension: process.env.RINGCENTRAL_EXTENSION_1!,
      password: process.env.RINGCENTRAL_PASSWORD_1!,
    });
    const ext1 = await rc1.restapi().account().extension().get();
    const phoneNumber1 = (
      await rc1.restapi().account().extension().phoneNumber().get()
    ).records!.filter(pn => pn.features?.includes('SmsSender'))[0].phoneNumber!;

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
    const phoneNumber2 = (
      await rc2.restapi().account().extension().phoneNumber().get()
    ).records!.filter(pn => pn.features?.includes('SmsSender'))[1].phoneNumber!;

    let count = 0;
    pubNubExtension1.subscribe(
      [
        `/restapi/v1.0/account/~/extension/${ext1.id}/message-store/instant?type=SMS`,
        `/restapi/v1.0/account/~/extension/${ext2.id}/message-store/instant?type=SMS`,
      ],
      () => {
        count += 1;
      }
    );

    await rc1
      .restapi()
      .account()
      .extension()
      .sms()
      .post({
        from: {phoneNumber: phoneNumber1},
        to: [{phoneNumber: phoneNumber2}],
        text: 'from admin to user',
      });

    await rc2
      .restapi()
      .account()
      .extension()
      .sms()
      .post({
        from: {phoneNumber: phoneNumber2},
        to: [{phoneNumber: phoneNumber1}],
        text: 'from user to admin',
      });

    const result = await waitFor({
      condition: () => count > 1,
      interval: 1000,
      times: 30,
    });

    expect(result).toBeTruthy();
    expect(count).toBeGreaterThanOrEqual(2);

    await rc1.revoke();
    await rc2.revoke();
  });

  test('as standard user', async () => {
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
    const phoneNumber1 = (
      await rc1.restapi().account().extension().phoneNumber().get()
    ).records!.filter(pn => pn.features?.includes('SmsSender'))[0].phoneNumber!;

    // standard user
    const rc2 = new RingCentral({
      clientId: process.env.RINGCENTRAL_CLIENT_ID!,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
      server: process.env.RINGCENTRAL_SERVER_URL!,
    });
    const pubNubExtension2 = new PubNubExtension();
    rc2.installExtension(pubNubExtension2);
    await rc2.authorize({
      username: process.env.RINGCENTRAL_USERNAME!,
      extension: process.env.RINGCENTRAL_EXTENSION_2!,
      password: process.env.RINGCENTRAL_PASSWORD_2!,
    });
    const ext2 = await rc2.restapi().account().extension().get();
    const phoneNumber2 = (
      await rc2.restapi().account().extension().phoneNumber().get()
    ).records!.filter(pn => pn.features?.includes('SmsSender'))[1].phoneNumber!;

    let count = 0;
    pubNubExtension2.subscribe(
      [
        `/restapi/v1.0/account/~/extension/${ext1.id}/message-store/instant?type=SMS`,
        `/restapi/v1.0/account/~/extension/${ext2.id}/message-store/instant?type=SMS`,
      ],
      () => {
        count += 1;
      }
    );

    await rc1
      .restapi()
      .account()
      .extension()
      .sms()
      .post({
        from: {phoneNumber: phoneNumber1},
        to: [{phoneNumber: phoneNumber2}],
        text: 'from admin to user',
      });

    await rc2
      .restapi()
      .account()
      .extension()
      .sms()
      .post({
        from: {phoneNumber: phoneNumber2},
        to: [{phoneNumber: phoneNumber1}],
        text: 'from user to admin',
      });

    const result = await waitFor({
      condition: () => count > 1,
      interval: 1000,
      times: 30,
    });

    expect(result).toBeFalsy();
    expect(count).toBe(1);

    await rc1.revoke();
    await rc2.revoke();
  });
});
