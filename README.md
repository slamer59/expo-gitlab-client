# Expo GitLab Client

A mobile client for GitLab built with Expo, providing a native experience for GitLab users on mobile devices.

## Features

- GitLab authentication and authorization
- View and manage projects
- Push notifications for GitLab events
- Issue tracking and management
- Merge request reviews
- Project activity feeds
- Dark/Light mode support

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your environment variables

## API Client Generation

curl -X POST -H "content-type:application/json" -d '{"swaggerUrl":"https://gitlab.com/gitlab-org/gitlab/-/raw/master/doc/api/openapi/openapi_v2.yaml"}' https://generator.swagger.io/api/gen/clients/typescript-fetch

## Development Setup

### First submission
https://github.com/expo/fyi/blob/main/first-android-submission.md

### Automatic submission
https://github.com/expo/fyi/blob/main/creating-google-service-account.md

## Expo notification
https://docs.expo.dev/push-notifications/push-notifications-setup/

### Test Notification
https://expo.dev/notifications

### Firebase Functions notification
https://github.com/firebase/functions-samples/tree/main/Python

Add runtime = python310 to cloud functions
`firebase deploy --only functions --debug` in `functions` folder

## Notification (Firebase)
[FCM credentials](https://docs.expo.dev/push-notifications/fcm-credentials/)

## Debug Expo 
https://www.youtube.com/watch?v=V-hois8dgM4
- ajout env dans eas.json pour preview et production
- ajout googleservice.json dans app.json (local)
- eas credeantials `eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value google-services.json`
- ajout GOOGLE_SERVICES_JSON dans eas.json

## Maestro setup

`maestro studio`

## Legal 
https://handbook.gitlab.com/handbook/marketing/brand-and-product-marketing/brand/brand-activation/trademark-guidelines/

https://design.gitlab.com/


## Gitlachemy test account

```gitalchemy@gmail.com
gitalchemy.test.account```
