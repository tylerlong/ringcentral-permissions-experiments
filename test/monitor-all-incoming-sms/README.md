# Monitor all incoming SMS

## As super admin

You can subscribe to 

```ts
[
  `/restapi/v1.0/account/~/extension/${ext1.id}/message-store/instant?type=SMS`,
  `/restapi/v1.0/account/~/extension/${ext2.id}/message-store/instant?type=SMS`,
  ...
]
```

And get notifications about all users' incoming SMS.


## As standard user

You can subscribe to others' incoming SMS notification, no API error.

But you will NOT receive notifications about others' incoming SMS at all.
