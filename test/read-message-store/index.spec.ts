import RingCentral from "@rc-ex/core";
import RestException from "@rc-ex/core/dist/esm/RestException";

jest.setTimeout(128000);

describe("read message store", () => {
  test("default", async () => {
    // super admin
    const rc1 = new RingCentral({
      clientId: process.env.RINGCENTRAL_CLIENT_ID!,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
      server: process.env.RINGCENTRAL_SERVER_URL!,
    });
    await rc1.authorize({
      jwt: process.env.TOKEN_1!,
    });
    const ext1 = await rc1.restapi().account().extension().get();

    // standard user
    const rc2 = new RingCentral({
      clientId: process.env.RINGCENTRAL_CLIENT_ID!,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
      server: process.env.RINGCENTRAL_SERVER_URL!,
    });
    await rc2.authorize({
      jwt: process.env.TOKEN_2!,
    });
    const ext2 = await rc2.restapi().account().extension().get();

    let r = await rc1
      .restapi()
      .account()
      .extension(ext1.id!.toString())
      .messageStore()
      .list({ dateFrom: "2016-03-10T18:07:52.534Z" });
    expect(r.records?.length).toBeGreaterThan(0);
    let ext1MessageId = r.records![0].id!.toString();
    r = await rc2
      .restapi()
      .account()
      .extension(ext2.id!.toString())
      .messageStore()
      .list({ dateFrom: "2016-03-10T18:07:52.534Z" });
    expect(r.records?.length).toBeGreaterThan(0);

    // admin read other's message store
    r = await rc1
      .restapi()
      .account()
      .extension(ext2.id!.toString())
      .messageStore()
      .list({ dateFrom: "2016-03-10T18:07:52.534Z" });
    expect(r.records?.length).toBeGreaterThan(0);
    r = await rc1
      .restapi()
      .account()
      .extension(ext2.id!.toString())
      .messageStore(r.records![0].id!.toString())
      .get();

    // standard user list other's message store
    let exception: RestException | undefined = undefined;
    try {
      r = await rc2
        .restapi()
        .account()
        .extension(ext1.id!.toString())
        .messageStore()
        .list({ dateFrom: "2016-03-10T18:07:52.534Z" });
      expect(r.records?.length).toBeGreaterThan(0);
    } catch (e) {
      exception = e as RestException;
    }
    expect(exception).toBeDefined();
    expect(exception!.message.includes("CMN-419"));
    expect(
      exception!.message.includes(
        "user needs to have [ReadMessages] permission granted with extended scope",
      ),
    );

    // standard user read other's message store by id
    try {
      const r2 = await rc2
        .restapi()
        .account()
        .extension(ext1.id!.toString())
        .messageStore(ext1MessageId)
        .get();
      expect(r2.id).toEqual(ext1MessageId);
    } catch (e) {
      exception = e as RestException;
    }
    expect(exception).toBeDefined();
    expect(exception!.message.includes("CMN-419"));
    expect(
      exception!.message.includes(
        "user needs to have [ReadMessages] permission granted with extended scope",
      ),
    );

    await rc1.revoke();
    await rc2.revoke();
  });
});
