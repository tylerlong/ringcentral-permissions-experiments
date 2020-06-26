import RingCentral from 'ringcentral-extensible';

const rc1 = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  server: process.env.RINGCENTRAL_SERVER_URL!,
});
const rc2 = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  server: process.env.RINGCENTRAL_SERVER_URL!,
});

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

  const phoneNumber1 = (
    await rc1.restapi().account().extension().phoneNumber().get()
  ).records!.filter(pn => pn.features?.includes('SmsSender'))[0].phoneNumber!;

  const phoneNumber2 = (
    await rc2.restapi().account().extension().phoneNumber().get()
  ).records!.filter(pn => pn.features?.includes('SmsSender'))[1].phoneNumber!;

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

  await rc1.revoke();
  await rc2.revoke();
})();
