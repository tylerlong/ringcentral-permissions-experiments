# Call control

Ref: https://medium.com/ringcentral-developers/ringcentral-telephony-session-events-notifications-98b3f8d29745

> It’s worth to mention that you don’t need to be an admin user to subscribe for the account level notification, or for multiple extensions notification. 

> Also, you will not be allowed to use the call information to control active calls of other extensions even if you are an admin user.

> In order to forward an incoming call to another destination, your app must be authenticated (logged in) by the same extension which supposes to receive the call. For example, if you receive notification of an incoming call to the extension 105 and you want to forward the call to extension 110 or to a PSTN number, you have to login the app with the extension 105 login credentials.