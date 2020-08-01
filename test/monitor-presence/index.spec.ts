import RingCentral from '@rc-ex/core';
import PubNubExtension from '@rc-ex/pubnub';
import waitFor from 'wait-for-async';

jest.setTimeout(128000);

describe('monitor incoming SMS', () => {
  // test('as super admin', async () => {
  //   // super admin
  //   const rc1 = new RingCentral({
  //     clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  //     clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  //     server: process.env.RINGCENTRAL_SERVER_URL!,
  //   });
  //   const pubNubExtension1 = new PubNubExtension();
  //   rc1.installExtension(pubNubExtension1);
  //   await rc1.authorize({
  //     username: process.env.RINGCENTRAL_USERNAME!,
  //     extension: process.env.RINGCENTRAL_EXTENSION_1!,
  //     password: process.env.RINGCENTRAL_PASSWORD_1!,
  //   });
  //   // standard user
  //   const rc2 = new RingCentral({
  //     clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  //     clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  //     server: process.env.RINGCENTRAL_SERVER_URL!,
  //   });
  //   await rc2.authorize({
  //     username: process.env.RINGCENTRAL_USERNAME!,
  //     extension: process.env.RINGCENTRAL_EXTENSION_2!,
  //     password: process.env.RINGCENTRAL_PASSWORD_2!,
  //   });
  //   const ext2 = await rc2.restapi().account().extension().get();
  //   const phoneNumber2 = (
  //     await rc2.restapi().account().extension().phoneNumber().get()
  //   ).records!.filter(pn => pn.features?.includes('CallerId') && pn.features?.includes('SmsSender'))[0].phoneNumber!;
  //   console.log(`Standard user phone number is ${phoneNumber2}`);
  //   pubNubExtension1.subscribe(
  //     [
  //       `/restapi/v1.0/account/~/extension/${ext2.id}/presence?detailedTelephonyState=true`,
  //     ],
  //     message => {
  //       console.log(JSON.stringify(message, null, 2));
  //     }
  //   );
  //   console.log(`Call phone number ${phoneNumber2} to trigger a notification`);
  //   await waitFor({interval: 60000});
  //   await rc1.revoke();
  //   await rc2.revoke();
  // });
  // test('as standard user', async () => {
  //   // super admin
  //   const rc1 = new RingCentral({
  //     clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  //     clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  //     server: process.env.RINGCENTRAL_SERVER_URL!,
  //   });
  //   await rc1.authorize({
  //     username: process.env.RINGCENTRAL_USERNAME!,
  //     extension: process.env.RINGCENTRAL_EXTENSION_1!,
  //     password: process.env.RINGCENTRAL_PASSWORD_1!,
  //   });
  //   const ext1 = await rc1.restapi().account().extension().get();
  //   const phoneNumber1 = (
  //     await rc1.restapi().account().extension().phoneNumber().get()
  //   ).records!.filter(
  //     pn =>
  //       pn.features?.includes('CallerId') && pn.features?.includes('SmsSender')
  //   )[0].phoneNumber!;
  //   console.log(`Super admin phone number is ${phoneNumber1}`);
  //   // standard user
  //   const rc2 = new RingCentral({
  //     clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  //     clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  //     server: process.env.RINGCENTRAL_SERVER_URL!,
  //   });
  //   const pubNubExtension2 = new PubNubExtension();
  //   rc2.installExtension(pubNubExtension2);
  //   await rc2.authorize({
  //     username: process.env.RINGCENTRAL_USERNAME!,
  //     extension: process.env.RINGCENTRAL_EXTENSION_2!,
  //     password: process.env.RINGCENTRAL_PASSWORD_2!,
  //   });
  //   pubNubExtension2.subscribe(
  //     [
  //       `/restapi/v1.0/account/~/extension/${ext1.id}/presence?detailedTelephonyState=true`,
  //     ],
  //     message => {
  //       console.log(JSON.stringify(message, null, 2));
  //     }
  //   );
  //   console.log(`Call phone number ${phoneNumber1} to trigger a notification`);
  //   await waitFor({interval: 60000});
  //   await rc1.revoke();
  //   await rc2.revoke();
  // });
});
