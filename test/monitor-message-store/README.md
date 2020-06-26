# Monitor message store

## As super admin

You can subscribe to 

```ts
[
  `/restapi/v1.0/account/~/extension/${ext1.id}/message-store`,
  `/restapi/v1.0/account/~/extension/${ext2.id}/message-store`,
  ...
]
```

And get notifications about all users' message stores.


## As standard user

You can subscribe to others' incoming SMS notification, no API error.

But you will NOT receive notifications about others' incoming SMS at all.
