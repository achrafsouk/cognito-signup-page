const { CognitoIdentityProviderClient, SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

const custom_cognito_endpoint = "https://yourdomain.cloudfront.net"

const captcha_api_key ="jG/wcF/4VTzPN93vfdQSG...long string...DJwBe5ubCFM7DltNzkYW82C9s=_0_1";

// User Pool Client ID
const clientId = "5jffkijsulbgi2ti8es3feb431";

// Configure the Cognito client
const client = new CognitoIdentityProviderClient({
    region: "us-east-1",
    endpoint : custom_cognito_endpoint,
});

// Function to handle form submission
function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    
    // Clear previous messages
    messageDiv.textContent = "Signing up...";
    messageDiv.className = "info";
    
    // Create the signup command
    const signUpCommand = new SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            }
        ]
    });

    function renderCaptcha() {
        console.log('rendering captcha');
        const container = document.getElementById('captcha');
        AwsWafCaptcha.renderCaptcha(container, {
          apiKey: captcha_api_key,
            onSuccess: captchaSuccess,
            onError: captchaFailure,
        });
    }
    
    function captchaSuccess() {
        console.log('captcha attempt was successful');
        const container = document.getElementById('captcha');
        container.innerHTML = '';
        signUpCommand.middlewareStack.add((next, context) => async (args) => {
                const aws_token = await AwsWafIntegration.getToken();
                console.log('token', aws_token);
                args.request.headers["X-Aws-Waf-Token"] = aws_token;
                return next(args);
            },
            {
                step: "build",
            }, {});
        console.log('sending command again');
        sendSignUpCommand(signUpCommand);
    }

    function captchaFailure() {
        messageDiv.textContent = `Failed captcha attempt, try again`;
        messageDiv.className = "error";
    }
    
    function sendSignUpCommand(command) {
        console.log('sending command', command);
            // Execute the signup command
        client.send(command).then(response => {
            // Handle successful signup
            messageDiv.textContent = "Signup successful! Please check your email for verification code.";
            messageDiv.className = "success";
            console.log("Signup successful:", response);
        })
        .catch(error => {
            // Handle signup error
            if (error.message.includes("captcha")){ // TODO, find a more deterministic way to detect this error based on response code.
                renderCaptcha()
            } else {
               messageDiv.textContent = `Signup failed: ${error.message}`;
               messageDiv.className = "error";
               console.error("Signup error:", error);
            }
        });
    }
    
    sendSignUpCommand(signUpCommand);

}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', handleSignup);
    }
});
