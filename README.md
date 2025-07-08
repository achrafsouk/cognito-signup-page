# Cognito Signup Page

A simple static signup page that integrates with AWS Cognito using AWS SDK v3.

## Setup

1. Create a Cognito user pool in `us-east-1` AWS Region, and note the User Pool Client ID, e.g. `5jffkijsulbgi2ti8es3feb431`
2. Create  CloudFront distribution, with cognito endpoint as origin `cognito-idp.us-east-1.amazonaws.com`, and with a default behavior that allows POST requests, `Caching Disabled` cache policy, `AllowAllViewerExceptHostHeader` for origin request policy, and `CORS-With-Preflight' response header policy. Note the CloudFront domain name, e.g. `d3puaf34ylufas.cloudfront.net`. This CloudFront distribution will be used to communicate with cognito.
3. Create an S3 bucket and a CloudFront distribution using this S3 bucket as an origin. Configure index.html as the defautl root object. Note the CloudFront domain name, eg.g. `jsd3247nds.cloudfront.net`. This CloudFront distribtion will be used to deliver the frontend.
4. Add a WAF WebACL to your use pool, and create a rule that always responds with a CAPTCHA. Set the token domain to the the fontend CloudFront distribution domain name.
5. Clone or download this repository
6. Install dependencies: `npm install`
7. Modify the cognito client id with yours in src/index.js and scrip.js files. Modify custom_cognito_endpoint constant in src/index to use your generated CloudFront domain.
8. Build the JavaScript bundle: `npm run build`
9. Upload the following files: index.html, styles.css, and dist/*





