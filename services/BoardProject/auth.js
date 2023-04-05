const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const crypto = require('crypto');
const user_pool_id = process.env.USER_POOL_ID;
const client_id = process.env.CLIENT_ID;
const IdentityPoolId = process.env.CLIENT_ID;
const poolData = {
          UserPoolId : user_pool_id, // your user pool id here  
          ClientId : client_id// your app client id here  
        };
AWS.config.update(
    {
        region: 'ap-northeast-2',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId,
            UserPoolId: user_pool_id,
        })
})

const cognito = new AWS.CognitoIdentityServiceProvider();

const signUp = async (event) => {
    try {        
        const { email, password } = JSON.parse(event.body);
        console.log(email);
        const params = {
            ClientId: client_id,
            Username: email,
            Password: password
        }
        const response = await cognito.signUp(params).promise();
        console.log(response);
        return 'sucess';
    } catch (error) {
        console.log(error);
        return error;
    }
}

const verification = async event => {
	const { code, email }= JSON.parse(event.body)

	let params = { ClientId: client_id, ConfirmationCode: code, Username: email }
	return new Promise((resolve, reject) => {
		cognito.confirmSignUp(params, async (err, data) => {
			if (err) {
				console.log('err: ', err)
				if (err.code === 'ExpiredCodeException') {
					await resendConfirmationCode({ email })
				}
				reject('Email verification error.')
			} else {
				resolve('ok')
			}
		})
	})
}

const resendConfirmationCode = async params => {
	const { email } = params
	console.log('email', email)
	return new Promise((resolve, reject) => {
		cognito.resendConfirmationCode({
			ClientId: client_id,
			Username: email
		}, async (err, data) => {
			if (err) {
				console.log(err)
				reject('Email verification error.')
			} else {
				resolve('resend confirmation code email')
			}
		})
	})
}

// const login = async (event) => {
//     try {
        
//         const { email, password } = JSON.parse(event.body);
//         const secretHash = await generateHash(email);

        
//         const params = {
            
//             ClientId: client_id,
//             AuthFlow: "ADMIN_NO_SRP_AUTH",
//             UserPoolId: user_pool_id,
//             AuthParameters:{
//                 USERNAME: email,
//                 PASSWORD: password,
//                 SECRET_HASH:secretHash
                
//             }

//         }
        
//         const response = await cognito.adminInitiateAuth(params).promise(); // 잘못됨

//         console.log(response);

//         return new Promise((resolve, reject) => {
//              AWS.config.credentials.get((err)=>{
//                 if(err){
//                     reject(err);
//                 }else{
//                     // Credentials will be available when this function is called.
//                     var accessKeyId = AWS.config.credentials.accessKeyId;
//                     var secretAccessKey = AWS.config.credentials.secretAccessKey;
//                     var sessionToken = AWS.config.credentials.sessionToken;
//                     const result = {accessKeyId, secretAccessKey, sessionToken};
//                     resolve(result);
//                 }
//             })
//         })
       
//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// }
const login = async (event) => {
    const { email, password } = JSON.parse(event.body);
  // Create the User Pool Object  
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username : email, // your username here  
      Pool : userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    // console.log(cognitoUser);
    const authenticationData = {
      Username : email, // your username here  
      Password: password
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );

    try {
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    // var accessToken = result.getAccessToken().getJwtToken();
                    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
                    // var idToken = result.idToken.jwtToken;
                    // var refreshToken = result.refreshToken.token;
                    // console.log(tokenRefresh(refreshToken));
                    AWS.config.credentials.get((err)=>{
                                        if(err){
                                            reject(err);
                                        }else{
                                            // Credentials will be available when this function is called.
                                            var accessKeyId = AWS.config.credentials.accessKeyId;
                                            var secretAccessKey = AWS.config.credentials.secretAccessKey;
                                            var sessionToken = AWS.config.credentials.sessionToken;
                                            Object.assign(result, {
                                                accessKeyId,
                                                secretAccessKey,
                                                sessionToken,
                                            })
                                            resolve(result);
                                        }
                                    })
                },
        
                onFailure: function(err) {
                    reject(err);
                }
            })
          })

        }
        catch (error) {
          // Probably a mis-typed password
          console.log(error.message)
        }

  };
  
const tokenRefresh = async (param)=>{
    return new Promise((resolve, reject) => {
        const { refreshToken } = param
        
        const cognito = new AWS.CognitoIdentityServiceProvider();
        const params = {
                        AuthFlow: 'REFRESH_TOKEN_AUTH',
                        ClientId: client_id,
                        UserPoolId: user_pool_id,
                        AuthParameters: {
                            refreshToken
                        }
                    }
        cognito.adminInitiateAuth(params, (err, data)=>{
            if(err){
                return reject(err);
            }
            resolve(data);
        });
    })
}

module.exports = {
    signUp, login, verification, tokenRefresh

}