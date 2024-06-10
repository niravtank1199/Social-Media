$(document).ready(function () {
    var userId = getCookie('userId');
    if (userId == null) {
        if (window.location.pathname === "/SMF/HomePage" || window.location.pathname == "/SMF/aboutpage" || window.location.pathname == "/SMF/AboutPage") {
            console.log('User not logged in. Redirecting to login page.');
            window.location.href = "/SMF/Login";
        }
    } else {
        console.log('User ID:', userId);
        window.location.href = "/SMF/Homepage";
    }

    $('#Email').on('input', function () {
        $("#loginError").text("");
    });
    $('#Password').on('input', function () {
        $("#loginError").text("");
    });
    $('#lastName').on('input', function () {
        $("#EmailError").text("");
    });
    $('#FirstName').on('input', function () {
        $("#NewloginError").text("");
    });
    $('#NewEmail').on('input', function () {
        $("#NewloginError").text("");
    });
    $('#NewPassword').on('input', function () {
        $("#NewloginError").text("");
    });
    $('#forgotPasswordEmail').on('input', function () {
        $("#NewloginError").text("");
    });
});

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

window.handleLogin = function () {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email.trim()) {
        $("#loginError").text("Please enter your email.");
        return;
    } else if (/\s/.test(email)) {
        $("#loginError").text("Email must not contain spaces.");
        return;
    } else if (!emailRegex.test(email)) {
        $("#loginError").text("Please enter a valid email address.");
        return;
    }

    if (!password.trim()) {
        $("#loginError").text("Please enter your password.");
        return;
    } else if (/\s/.test(password)) {
        $("#loginError").text("Password must not contain spaces.");
        return;
    }

    $.ajax({
        url: '/api/WebApi/Login',
        type: 'GET',
        data: { email: email, password: password },
        success: function (response) {
            setCookie('userId', response.UserId, 1);
            sessionStorage.setItem('userId', response.UserId);
            window.location.href = "/SMF/HomePage";
            console.log("Login successful", response);
        },
        error: function (xhr, status, error) {
            console.error("Login failed", error);
            if (xhr.status === 400) {               
                window.location.href = '/SMF/confirmotp?email=' + email;
            } else {
                $("#loginError").text("Email or password invalid.");
            }
        }
    });
};


window.handleSignup = function () {
    var lastName = document.getElementById("lastName").value.trim();
    var firstName = document.getElementById("FirstName").value.trim();
    var newEmail = document.getElementById("NewEmail").value.trim();
    var newPassword = document.getElementById("NewPassword").value.trim();

    var nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!lastName) {
        $("#NewloginError").text("Please enter your last name.");
        return;
    } else if (!nameRegex.test(lastName)) {
        $("#NewloginError").text("Last name must contain only alphabets separated by single space.");
        return;
    }

    if (!firstName) {
        $("#NewloginError").text("Please enter your first name.");
        return;
    } else if (!nameRegex.test(firstName)) {
        $("#NewloginError").text("First name must contain only alphabets separated by single space.");
        return;
    }

    if (!newEmail) {
        $("#NewloginError").text("Please enter your email.");
        return;
    } else if (/\s/.test(newEmail)) {
        $("#NewloginError").text("Email must not contain spaces.");
        return;
    } else if (!emailRegex.test(newEmail)) {
        $("#NewloginError").text("Please enter a valid email address.");
        return;
    }

    if (!newPassword) {
        $("#NewloginError").text("Please enter your password.");
        return;
    } else if (/\s/.test(newPassword)) {
        $("#NewloginError").text("Password must not contain spaces.");
        return;
    } else if (!passwordRegex.test(newPassword)) {
        $("#NewloginError").text("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        return;
    }

    const formData = {
        lastName: lastName,
        firstName: firstName,
        email: newEmail,
        userpassword: newPassword
    };

    $.ajax({
        url: '/api/WebApi/Register',
        type: 'POST',
        data: formData,
        success: function (response) {           
            console.log("Signup successful", response);
            console.log(response);
            window.location.href = "/SMF/confirmotp?email=" + encodeURIComponent(response.Email);
        },
        error: function (error) {
            console.log("code:" + error.status);
            if (error.status == 409) {
                $("#NewloginError").text("Email Already Exists");
            } else {
                console.error("Signup failed", error);
                $("#NewloginError").text("Email or password invalid.");
            }
        }
    });
};


function handleForgotPassword() {
    var email = $('#forgotPasswordEmail').val();
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailPattern.test(email)) {
        $('#forgotPasswordError').text('Please enter a valid email address.');
        return;
    }
    $('#forgotPasswordError').text('');

    $.ajax({
        type: 'POST',
        url: '/api/WebApi/forgotpassword?email=' + email,
        data: { email: email },
        success: function (response) {
            $('#forgotPasswordError').text('Password reset email has been sent.').css('color', 'green');
            console.log("Password reset email sent to: " + email);
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred. Please try again.';
            $('#forgotPasswordError').text(errorMessage).css('color', 'red');
            console.log("Error: " + errorMessage);
        }
    });
}



