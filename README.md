# Node Client for subscribing to BulkApi2JobEvent using Pub/Sub API



See the [official Bulk API V2 Query documentation](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/queries.htm) for more information on the Bulk V2 Query API.

See the [official Pub/Sub API repo](https://github.com/developerforce/pub-sub-api) for more information on the Salesforce gRPC-based Pub/Sub API.

See the pub-sub-api-node-client(https://github.com/pozil/pub-sub-api-node-client) for information on how to integrate this node client in an application

> Note : For eventing capability to work and this app to start, make sure the `PartialDownloadAndJobEvent` org preference is turned on for your org 

This demo is built with the Lightning Web Runtime and demonstrates subscribing to 'BulkApi2JobEvent' using Pub/Sub API. 

🎥 Watch a short [introduction video](https://youtu.be/g9P87_loVVA) to learn more about the Pub/Sub API

> **Warning**<br/>
> This demo app does not use the most secure authentication mechanism. We recommend using an [OAuth 2.0 JWT Bearer Flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5) for production environments.

## Installation

You can either install the app on

-   [Heroku](#heroku-deploy) (quick deployment for demo purposes)
-   your [local machine](#local-setup) (preferred for development purposes)

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
    SALESFORCE_AUTH_TYPE="username-password"
    SALESFORCE_LOGIN_URL="https://test.salesforce.com"
    SALESFORCE_API_VERSION="56.0"
    SALESFORCE_USERNAME="YOUR_SALESFORCE_USERNAME"
    SALESFORCE_PASSWORD="YOUR_SALESFORCE_PASSWORD"
    PUB_SUB_ENDPOINT="api.pubsub.salesforce.com:7443"
    ```

1. Update the property values by referring to the [configuration reference](#configuration-reference) section

1. Install the project with `npm install`

1. Run the project with `npm start`

## Configuration reference


| Variable                 | Description                                                                                                                                                                                              | Example                             |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| `SALESFORCE_AUTH_TYPE`   | The Salesforce authentication type for the Pub/Sub API client.                                                                                                                                           | `username-password` |
| `SALESFORCE_LOGIN_URL`   | The login URL of your Salesforce org:<br>`https://test.salesforce.com/` for scratch orgs and sandboxes<br/>`https://login.salesforce.com/` for Developer Edition and production                          | `https://test.salesforce.com`       |
| `SALESFORCE_API_VERSION` | The Salesforce API version.                                                                                                                                                                              | `62.0`                              |
| `SALESFORCE_PASSWORD`    | Your Salesforce user's password. You might have to append security token to your password for logging in. Reference - https://help.salesforce.com/s/articleView?id=xcloud.user_security_token.htm&type=5 | n/a                                 |
| `SALESFORCE_USERNAME`    | Your Salesforce username.                                                                                                                                                                                | n/a                                 | | n/a                                 |
| `PUB_SUB_ENDPOINT`       | The endpoint used by the Pub/Sub API.                                                                                                                                                                    | `api.pubsub.salesforce.com:7443`    |

You can refer to [README.md file of pub-sub-api-node-client](https://github.com/pozil/pub-sub-api-node-client/blob/main/README.md) to learn more details about using different types of authentication mechanisms
