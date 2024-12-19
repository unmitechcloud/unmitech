import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
const poolData = {
    UserPoolId: 'ap-south-1_NdWHgJ3gZ', // Your user pool id here
    ClientId: '3f0g9v20p3dlj8lffci0bhd472' // Your client id here
};
const userPool = new CognitoUserPool(poolData);

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();
        if (!cognitoUser) {
            reject(new Error("No user found"));
            return;
        }
        cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
                reject(err);
                return;
            }
            const userAttributes = {};
            attributes.forEach(attribute => {
                userAttributes[attribute.Name] = attribute.Value;
            });
            resolve(userAttributes);
        });
    });
};