// Configure AWS SDK
AWS.config.region = 'us-east-1';

// User Pool Client ID
const clientId = "5jffkijsulbgi2ti8es3feb431";

// Create Cognito service object
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    // Clear previous messages
    messageDiv.textContent = "Signing up...";
    messageDiv.className = "info";
    
    // Set up parameters for signup
    const params = {
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            }
        ]
    };
    
    // Call signUp method
    cognitoIdentityServiceProvider.signUp(params, function(err, data) {
        if (err) {
            // Handle signup error
            messageDiv.textContent = `Signup failed: ${err.message}`;
            messageDiv.className = "error";
            console.error("Signup error:", err);
        } else {
            // Handle successful signup
            messageDiv.textContent = "Signup successful! Please check your email for verification code.";
            messageDiv.className = "success";
            console.log("Signup successful:", data);
        }
    });
});
