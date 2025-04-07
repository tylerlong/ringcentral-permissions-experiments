# Read message store

## As super admin

You can read other's message store:

```ts
r = await rc1
  .restapi()
  .account()
  .extension(ext2.id!.toString())
  .messageStore()
  .list();
expect(r.records?.length).toBeGreaterThan(0);
```

## As standard user

You are not allowed to read other's message store:

```
"data": {
  "errorCode": "CMN-419",
  "message": "In order to call this API endpoint for another extension, user needs to have [ReadMessages] permission granted with extended scope",
  "errors": [
    {
      "errorCode": "CMN-419",
      "message": "In order to call this API endpoint for another extension, user needs to have [ReadMessages] permission granted with extended scope",
      "permissionsName": "ReadMessages"
    }
  ],
  "permissionsName": "ReadMessages"
},
"status": 403,
"statusText": "Forbidden",
```

## Read a specify message by id

```ts
r = await rc1
  .restapi()
  .account()
  .extension(ext2.id!.toString())
  .messageStore(messsage.id)
  .get();
expect(r.records?.length).toBeGreaterThan(0);
```

Same result as above.
