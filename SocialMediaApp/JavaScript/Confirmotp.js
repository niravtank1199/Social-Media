$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (email == null) {
        window.location.href = "/SMF/login";
    }

    $("#Resend").click(function () {
        console.log("send");
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');

        if (email) {
            $.ajax({
                type: "post",
                url: '/api/Webapi/Sendotp?email=' + email,
                data: { email: email },
                success: function (response) {
                    console.log('OTP sent successfully');
                },
                error: function (xhr, status, error) {
                    console.error('Failed to send OTP:', error);
                }
            });
        } else {
            console.error('No email parameter found in the query string.');
        }
    });
});


function handleOtpSubmit() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    CheckToken(email)
}

function CheckToken(email) {

    var otp = $("#otp").val();

    $.ajax({
        type: 'get',
        url: '/api/WebApi/CheckOtp',
        data: { email: email , otp : otp},
        success: function (response) {
            console.log("Token is valid");
            window.location.href = "/SMF/login";
        },
        error: function (error) {
            console.log("invalid");
        }
    });
}