const { CognitoIdentityProviderClient, SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

const custom_cognito_endpoint = "https://d3puaf34ylufas.cloudfront.net"

// Configure the Cognito client
const client = new CognitoIdentityProviderClient({
    region: "us-east-1",
    endpoint : custom_cognito_endpoint,
});

// User Pool Client ID
const clientId = "5jffkijsulbgi2ti8es3feb431";

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
          apiKey: 'VBRcoCrEDIqQGj4hAf+YhNEKZVkUA0ypS4aVGMdVaurHuOhd0xrUSUPwkJopPHg8uU76OD7Osvk4xwDXcKI+bY4CULrljsg3vIgYgmlHsrdORxKCr/Z5BwX8jLiHHGW+LRJFbmeJtLYLDJNSntrItJom4FQqQfR4EzF0K0MoD6pkBvJRfrDeHU1Vsaurb0kXRBo+k/5JjF6Mrlza/vvJd3oZl5OOycVc9xQc3xHMOok2vmfEpkWskTb3ZcX6oRappTMF0qW5HEvM67kQi1TLJJd3gRmlknhUj+nJzBVgN3qYLHpXsvYAeiL0u/+KMCXakRcLQxDSQ/AWQKHRjukyq3TUitB8L3Qq6RKNKPCVrRA00uOnvm1bmIPIw1VKSG+Cm1/nYTBpMIVlvGssp2FOPVmS9wiNCsGbKJDlvBw3Cc0eumhOMKWzuCNamlFvBgAJeHOmvnXmgkR6g8ZImIlE0roHG7GJCHdmoHYTpxD9+pvXsdGlr8ea9l+q5+h2iB0jzifHsielyxAAdLvfMexqgVIiO7TIHWGONS6yKitzL5HHYxwDUL0vy2Lt0p72BnKn6mmYAB5e31/lrWZ1lScqyjbHy6A8Le7eBKrFb5JzgXwXlDpW31WVSCow6rJw6eNBT5DqOLaUyEv2U7t49vV5s5HNkZSdmdBPaqEol6hsCW4=_0_1',
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
