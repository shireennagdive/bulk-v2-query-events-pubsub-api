# Node Client for subscribing to BulkApi2JobEvent using Pub/Sub API



See the [official Bulk API V2 Query documentation](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/queries.htm) for more information on the Bulk V2 Query API.

See the [official Pub/Sub API repo](https://github.com/developerforce/pub-sub-api) for more information on the Salesforce gRPC-based Pub/Sub API.

-   [Installation and Configuration](#installation-and-configuration)
    -   [User supplied authentication](#user-supplied-authentication)
    -   [Username/password flow](#usernamepassword-flow)
    -   [OAuth 2.0 client credentials flow (client_credentials)](#oauth-20-client-credentials-flow-client_credentials)
    -   [OAuth 2.0 JWT bearer flow](#oauth-20-jwt-bearer-flow)
-   [Basic Example](#basic-example)
-   [Other Examples](#other-examples)
    -   [Subscribe with a replay ID](#subscribe-with-a-replay-id)
    -   [Subscribe to past events in retention window](#subscribe-to-past-events-in-retention-window)
    -   [Work with flow control for high volumes of events](#work-with-flow-control-for-high-volumes-of-events)
    -   [Handle gRPC stream lifecycle events](#handle-grpc-stream-lifecycle-events)
    -   [Use a custom logger](#use-a-custom-logger)
-   [Common Issues](#common-issues)
-   [Reference](#reference)
    -   [PubSubApiClient](#pubsubapiclient)
    -   [PubSubEventEmitter](#pubsubeventemitter)
    -   [EventParseError](#eventparseerror)

This demo is built with the Lightning Web Runtime and demonstrates subscribing to 'BulkApi2JobEvent' using Pub/Sub API. 

🎥 Watch a short [introduction video](https://youtu.be/g9P87_loVVA).

> **Warning**<br/>
> This demo app does not use the most secure authentication mechanism. We recommend using an [OAuth 2.0 JWT Bearer Flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5) for production environments.

## Installation

You can either install the app on

-   [Heroku](#heroku-deploy) (quick deployment for demo purposes)
-   your [local machine](#local-setup) (prefered for development purposes)

### Heroku deploy

Click on this button and follow the instructions to deploy the app:

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/pozil/ebikes-manufacturing-lwc-oss">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
<p>

Once deployed, see the [configuration reference](#configuration-reference) section for configuring the environment variables.

### Local setup

1. Create a `.env` file at the root of the project

    ```properties
    SALESFORCE_AUTH_TYPE="user-supplied"
    SALESFORCE_LOGIN_URL="https://test.salesforce.com"
    SALESFORCE_API_VERSION="56.0"
    SALESFORCE_USERNAME="YOUR_SALESFORCE_USERNAME"
    SALESFORCE_PASSWORD="YOUR_SALESFORCE_PASSWORD"
    SALESFORCE_TOKEN="YOUR_SALESFORCE_SECURITY_TOKEN"

    PUB_SUB_ENDPOINT="api.pubsub.salesforce.com:7443"
    ```

1. Update the property values by referring to the [configuration reference](#configuration-reference) section

1. Install the project with `npm install`

1. Run the project with `npm start`

## Configuration reference

All variables are required.

| Variable                 | Description                                                                                                                                                                     | Example                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `SALESFORCE_AUTH_TYPE`   | The Salesforce authentication type for the Pub/Sub API client. Do not change this value.                                                                                        | `user-supplied`                  |
| `SALESFORCE_LOGIN_URL`   | The login URL of your Salesforce org:<br>`https://test.salesforce.com/` for scratch orgs and sandboxes<br/>`https://login.salesforce.com/` for Developer Edition and production | `https://test.salesforce.com`    |
| `SALESFORCE_API_VERSION` | The Salesforce API version.                                                                                                                                                     | `56.0`                           |
| `SALESFORCE_USERNAME`    | Your Salesforce user's password.                                                                                                                                                | n/a                              |
| `SALESFORCE_PASSWORD`    | Your Salesforce username.                                                                                                                                                       | n/a                              |
| `SALESFORCE_TOKEN`       | Your Salesforce user's security token.                                                                                                                                          | n/a                              |
| `PUB_SUB_ENDPOINT`       | The endpoint used by the Pub/Sub API.                                                                                                                                           | `api.pubsub.salesforce.com:7443` |
