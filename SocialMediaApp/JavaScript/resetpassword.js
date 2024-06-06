$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log("page load");
    CheckToken(token);

});

function CheckToken(token) {
    $.ajax({
        type: 'get',
        url: '/api/WebApi/CheckToken',
        data: { token: token },
        success: function (response) {
            console.log("Token is valid");
        },
        error: function (error) {
            var Tokenerror = `<h3 style="color: red;">Invalid Token or Token Was Expired...</h3>`;
            $("#forgotPasswordForm").hide();
            $(".log-title").hide();
            $(".forgot-pwd").append(Tokenerror);                
        }
    });
}

function handleResetPassword() {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');


    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();

    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!newPassword) {
        $("#passwordMatchError").text("Please enter your password.");
        passwordMatchError.style.color = "red";
        return;
    } else if (!confirmPassword) {
        $("#passwordMatchError").text("Please enter confirm password.");
        passwordMatchError.style.color = "red";
        return;
    } else if (newPassword !== confirmPassword) {
        $("#passwordMatchError").text("Passwords do not match.");
        passwordMatchError.style.color = "red";
        return;
    } else if (/\s/.test(newPassword)) {
        $("#passwordMatchError").text("Password must not contain spaces.");
        passwordMatchError.style.color = "red";
        return;
    } else if (!passwordRegex.test(newPassword)) {
        $("#passwordMatchError").text("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/api/WebApi/Resetpassword',
        data: { token: token, password: newPassword },
        success: function (response) {
            console.log("response:" + response);
            console.log("Password set");
            $("#passwordMatchError").text("Password Updated");
            passwordMatchError.style.color = "green";
            window.location.href = "/SMF/login";
        },
        error: function (error, xhr) {
            console.log("error" + error.status)
            if (error.status === 400) {
                var errorMessage = error.responseText;
                if (errorMessage === "Invalid token.") {
                    $("#passwordMatchError").html("The token is invalid. Please request a new password reset link.");
                } else if (errorMessage === "Token has expired.") {
                    $("#passwordMatchError").html("The token has expired. Please request a new password reset link.");
                } else {
                    $("#passwordMatchError").html(errorMessage);
                }
                //$("#passwordMatchError").text("Invalid Token");
                passwordMatchError.style.color = "red";
            } else {
                $("#tokenError").html("An error occurred. Please try again later.");
            }
        }      
    });
}
