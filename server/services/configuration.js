import * as dotenv from 'dotenv';

export default class Configuration {
    static checkConfig() {
        dotenv.config();
        [
            'SALESFORCE_LOGIN_URL',
            'SALESFORCE_API_VERSION',
            'SALESFORCE_USERNAME',
            'SALESFORCE_PASSWORD'
            // 'SALESFORCE_TOKEN'
        ].forEach((varName) => {
            if (!process.env[varName]) {
                console.error(`ERROR: Missing ${varName} environment variable`);
            }
        });
    }

    static getLoginUrl() {
        return process.env.SALESFORCE_LOGIN_URL;
    }

    static getApiVersion() {
        return process.env.SALESFORCE_API_VERSION;
    }

    static getUsername() {
        return process.env.SALESFORCE_USERNAME;
    }

    static getPassword() {
        return process.env.SALESFORCE_PASSWORD;
    }
}