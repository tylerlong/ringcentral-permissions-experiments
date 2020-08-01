# Send message on behalf of another

## As super admin

```
{
      "data": {
        "errorCode": "FeatureNotAvailable",
        "message": "Phone number doesn't belong to extension",
        "errors": [
          {
            "errorCode": "MSG-304",
            "message": "Phone number doesn't belong to extension"
          }
        ]
      },
      "status": 403,
      "statusText": "Forbidden",
```

## As standard user

```
{
      "data": {
        "errorCode": "FeatureNotAvailable",
        "message": "Phone number doesn't belong to extension",
        "errors": [
          {
            "errorCode": "MSG-304",
            "message": "Phone number doesn't belong to extension"
          }
        ]
      },
      "status": 403,
      "statusText": "Forbidden",
```
