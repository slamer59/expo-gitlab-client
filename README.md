# GitLab Client for Expo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/gitlab/v/release/thomas.pedot1/expo-gitlab-client?display_name=release&label=release)](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/releases)

GitLab Client for Expo is an open-source mobile application that provides a seamless interface for interacting with GitLab repositories and projects. It's built using Expo and supports both Android and iOS platforms, offering a native-like experience for GitLab users on the go.

[<img alt="Become a Patron" src="https://c5.patreon.com/external/logo/become_a_patron_button.png" height="40"/>](https://www.patreon.com/teepeetlse)

## Table of Contents
- [GitLab Client for Expo](#gitlab-client-for-expo)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Downloads](#downloads)
  - [Screenshots](#screenshots)
  - [Getting Started](#getting-started)
  - [Configuration](#configuration)
    - [Google Play Services](#google-play-services)
    - [Expo Notifications](#expo-notifications)
    - [Firebase Functions](#firebase-functions)
  - [Usage Examples](#usage-examples)
    - [Debugging](#debugging)
    - [Maestro Setup](#maestro-setup)
  - [Building](#building)
  - [Contributing](#contributing)
  - [Translation](#translation)
  - [Maintenance](#maintenance)
  - [License](#license)
  - [Contact](#contact)

## Features

- Multiple GitLab account support
- Repository and project management
- Issue tracking and creation
- Merge request handling
- Commit history viewing
- File exploration
- Integration with GitLab notifications
- Firebase-based push notifications
- Google Play services integration
- Dark mode support
- Offline capabilities
- Performance optimized for mobile devices

[Complete list of features](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/wikis/home)

## Blog

You can find some usefull information on [gitalchemy blog](https://gitalchemy.app)

## Downloads

<!-- [<img alt="Get it on F-Droid" src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/logos/fdroid.png" height="80">](https://f-droid.org/packages/com.thomas.pedot.expogitlabclient/) -->
[<img alt="Get it on Google Play" src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/logos/google-play.png" height="80">](https://play.google.com/store/apps/details?id=com.thomas.pedot.expogitlabclient)
[<img alt="Download APK" src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/logos/apk-badge.png" height="80">](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/releases)
<!-- [<img alt="Get it on OpenAPK" src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/logos/openapk.png" height="80">](https://www.openapk.net/labnex/com.thomas.pedot.expogitlabclient/) -->

## Screenshots

<table>
  <tr>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Home.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Project%20Details.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Merge%20Requests.png" width="200"/></td>
  </tr>
  <tr>
    <td>Home Screen</td>
    <td>Project Details</td>
    <td>Merge Requests</td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Issues.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Create%20Merge%20Request.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/ProfileOptions.png" width="200"/></td>
  </tr>
  <tr>
    <td>Issues</td>
    <td>Create Merge Request</td>
    <td>Profile Options</td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Merge%20Request%20Details.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Issue%20Details.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Project%20Merge%20Requests%20-%20SELECT%20BRANCH.png" width="200"/></td>
  </tr>
  <tr>
    <td>Merge Request Details</td>
    <td>Issue Details</td>
    <td>Select Branch</td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Merge%20Request%20Details%20Commits.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Merge%20Request%20Details%20Events.png" width="200"/></td>
    <td><img src="https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/raw/main/assets/maestro/Merge%20Request%20Edit.png" width="200"/></td>
  </tr>
  <tr>
    <td>MR Commits</td>
    <td>MR Events</td>
    <td>Edit Merge Request</td>
  </tr>
</table>

[View all screenshots](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/tree/main/assets/maestro)

## Getting Started

To get started with the GitLab Client for Expo:

1. Clone the repository:
```bash
git clone https://gitlab.com/thomas.pedot1/expo-gitlab-client.git
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

## Configuration

### Google Play Services
1. [First submission setup](https://github.com/expo/fyi/blob/main/first-android-submission.md)
2. [Automatic submission configuration](https://github.com/expo/fyi/blob/main/creating-google-service-account.md)

### Expo Notifications
1. [Setup guide](https://docs.expo.dev/push-notifications/push-notifications-setup/)
2. [Test notifications](https://expo.dev/notifications)

### Firebase Functions
1. Add runtime configuration to cloud functions:
```bash
runtime = python310
```

2. Deploy functions:
```bash
firebase deploy --only functions --debug
```

## Usage Examples

### Debugging
Check out our [debugging guide video](https://www.youtube.com/watch?v=V-hois8dgM4) for detailed instructions.

### Maestro Setup
```bash
maestro studio
```

## Building

For detailed instructions on building the app from source, please refer to our [Building Guide](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/wikis/Building).

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/wikis/Contributing) for more details.

## Translation

We're planning to support multiple languages in the future. If you're interested in helping with translations, please [open an issue](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/issues) to discuss the process.

## Maintenance

- Regular updates to keep up with GitLab API changes
- Bug fixes and performance improvements
- New feature implementations based on user feedback
- Security updates

## License

This project is licensed under the MIT License. This means:

- You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software.
- You must include the original copyright notice and the permission notice in all copies or substantial portions of the software.
- The software is provided "as is", without warranty of any kind.

For the full license text, see the [LICENSE](LICENSE) file in the repository.

```
MIT License

Copyright (c) 2025 Thomas Pedot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Contact

For questions, feedback, or support, please contact:
- Email: thomas.pedot@gmail.com
- [Create an issue](https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/issues)

---

*All trademarks and logos are the properties of their respective owners.*
