# Publishing to OpenAPK with GitLab CI/CD

This guide explains how to set up automatic APK building and publishing to GitLab Releases for OpenAPK and Obtainium integration.

## Overview

The CI/CD pipeline is configured to:

1. Build an Android APK using Expo Application Services (EAS) when a new tag is created
2. Download the APK and attach it to a GitLab Release
3. Make the APK available for OpenAPK and Obtainium users

## Required CI/CD Variables

To enable the automated build and publish process, you need to set up the following GitLab CI/CD variables:

### 1. EAS_TOKEN

This token allows the CI/CD pipeline to authenticate with Expo Application Services to build your app.

To obtain an EAS token:

1. Go to [https://expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)
2. Click "Create token"
3. Give it a name (e.g., "GitLab CI/CD")
4. Copy the generated token

To add it to GitLab:

1. Go to your GitLab project
2. Navigate to Settings > CI/CD > Variables
3. Click "Add variable"
4. Set the key as `EAS_TOKEN`
5. Paste the token as the value
6. Check "Mask variable" to hide it in logs
7. Save the variable

### 2. GITLAB_TOKEN

This token allows the CI/CD pipeline to create releases and attach assets.

To create a GitLab personal access token:

1. Go to your GitLab user settings
2. Navigate to Access Tokens
3. Create a new token with the following scopes:
   - `api`
   - `read_repository`
   - `write_repository`
4. Copy the generated token

To add it to GitLab:

1. Go to your GitLab project
2. Navigate to Settings > CI/CD > Variables
3. Click "Add variable"
4. Set the key as `GITLAB_TOKEN`
5. Paste the token as the value
6. Check "Mask variable" to hide it in logs
7. Save the variable

## Creating a New Release

To create a new release:

1. Update the version in `app.json`:
   ```json
   {
     "expo": {
       "version": "1.2.3",
       "android": {
         "versionCode": 12
       }
     }
   }
   ```

2. Create and push a new tag:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

3. The CI/CD pipeline will automatically:
   - Build the APK using EAS
   - Create a GitLab release with the APK attached

## OpenAPK Integration

OpenAPK will automatically detect and list your app based on the GitLab releases. Users can install your app directly from OpenAPK.

## Obtainium Updates

Users can receive automatic updates using Obtainium by adding your GitLab repository URL:

```
https://gitlab.com/thomas.pedot1/expo-gitlab-client
```

Obtainium will check for new releases and notify users when updates are available.

## Troubleshooting

If the pipeline fails:

1. Check the job logs for error messages
2. Verify that the EAS_TOKEN and GITLAB_TOKEN variables are set correctly
3. Ensure your Expo account has sufficient build minutes available
4. Check that the app.json configuration is valid
