import jsforce from 'jsforce';

export default class SalesforceClient {
    connection;

    async authenticate(loginUrl, username, password, version) {

        const connection = new jsforce.Connection({
            loginUrl,
            version
        });

        const loginResult = await connection.login(username, password);
        console.log(
            `Connected to Salesforce org ${loginResult.organizationId}: ${connection.instanceUrl}`
        );
        this.connection = connection;
        return this.connection;
    }
}




