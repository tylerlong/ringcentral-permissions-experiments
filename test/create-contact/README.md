# Create address book contact


## Super admin

Super admin is able to create contact for other users.


## Standard user

Standard user cannot create contact for other users, error message is:

```json
{
"data": {
  "errorCode": "CMN-419",
  "message": "In order to call this API endpoint for another extension, user needs to have [EditPersonalContacts] permission granted with extended scope",
  "errors": [
    {
      "errorCode": "CMN-419",
      "message": "In order to call this API endpoint for another extension, user needs to have [EditPersonalContacts] permission granted with extended scope",
      "permissionsName": "EditPersonalContacts"
    }
  ],
  "permissionsName": "EditPersonalContacts"
}
```
