import RingCentral from 'ringcentral-extensible';
import PubNubExtension from 'ringcentral-extensible/build/extensions/pubNub';
import waitFor from 'wait-for-async';

const rc1 = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  server: process.env.RINGCENTRAL_SERVER_URL!,
});
const pubNubExtension1 = new PubNubExtension();
rc1.installExtension(pubNubExtension1);

const rc2 = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  server: process.env.RINGCENTRAL_SERVER_URL!,
});
const pubNubExtension2 = new PubNubExtension();
rc2.installExtension(pubNubExtension2);

(async () => {
  await rc1.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION_1!,
    password: process.env.RINGCENTRAL_PASSWORD_1!,
  });
  await rc2.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION_2!,
    password: process.env.RINGCENTRAL_PASSWORD_2!,
  });

  const ext1 = await rc1.restapi().account().extension().get();
  const ext2 = await rc2.restapi().account().extension().get();

  const phoneNumber1 = (
    await rc1.restapi().account().extension().phoneNumber().get()
  ).records!.filter(pn => pn.features?.includes('SmsSender'))[0].phoneNumber!;
  const phoneNumber2 = (
    await rc2.restapi().account().extension().phoneNumber().get()
  ).records!.filter(pn => pn.features?.includes('SmsSender'))[1].phoneNumber!;

  let count = 0;
  pubNubExtension1.subscribe(
    [
      `/restapi/v1.0/account/~/extension/${ext1.id}/message-store/instant?type=SMS`,
      `/restapi/v1.0/account/~/extension/${ext2.id}/message-store/instant?type=SMS`,
    ],
    event => {
      console.log(JSON.stringify(event, null, 2));
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
      text: 'hello world',
    });

  await rc2
    .restapi()
    .account()
    .extension()
    .sms()
    .post({
      from: {phoneNumber: phoneNumber2},
      to: [{phoneNumber: phoneNumber1}],
      text: 'hello world',
    });

  await waitFor({condition: () => count > 1, interval: 1000, times: 30});

  console.log(count);

  await rc1.revoke();
  await rc2.revoke();
})();
