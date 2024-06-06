$(document).ready(function () {
    const userId = sessionStorage.getItem('UserProfileId');
    
    console.log(userId);
    if (userId == null) {
        //if (window.location.pathname === "/SMF/UserProfile") {
            //console.log('User not logged in. Redirecting to login page.');
            window.location.href = "/SMF/Login";
        //}
    } else {
        console.log('User ID:', userId);
    }

    populateUserData(userId);
    loadUserPosts();
    GetFriendList();

    $("#logoutButton").click(function () {
        setCookie('userId', '', -1);
        sessionStorage.removeItem('UserProfileId');
        console.log('Logging out. Redirecting to login page.');
        location.reload();
    });

    $('#editinfo-link').click(function () {
        $('#timeline-div').hide();
        $('#editinfo-div').show();
        $('#UserPost-div').hide();

        $('#timeline-link').removeClass('active');
        $('#editinfo-link').addClass('active');
        $('#UserPost-link').removeClass('active');
    });
    
    $('#timeline-link').click(function () {
        $('#timeline-div').show();
        $('#editinfo-div').hide();
        $('#UserPost-div').hide();

        $('#editinfo-link').removeClass('active');
        $('#timeline-link').addClass('active');
        $('#UserPost-link').removeClass('active');
    });

    $('#UserPost-link').click(function () {
        $('#UserPost-div').show();
        $('#editinfo-div').hide();
        $('#timeline-div').hide();

        $('#editinfo-link').removeClass('active');
        $('#UserPost-link').addClass('active');
        $('#timeline-link').removeClass('active');
    });

});


// show all user data to about page
function populateUserData(userId) {
    $.ajax({
        url: '/api/WebApi/' + userId,
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            var userData = response;
            sessionStorage.setItem('Username', response.FirstName + " " + response.LastName);
            sessionStorage.setItem('ProfilePhoto', userData.ProfilePhoto);
            $('h5#UserName').html(userData.LastName);
            $('li#UserName').html('<i class="fa-regular fa-user"></i>' + userData.LastName);
            $('#City').html('<i class="fa-solid fa-city"></i> ' + userData.City);
            $('#PhoneNumber').html('<i class="fa-solid fa-phone"></i> ' + userData.PhoneNumber);
            $('#Email').html('<i class="fa-solid fa-envelope"></i> ' + userData.Email);
            $('#interestdata').append('<li>' + userData.Interests + ' </li>');
            $('#BioInfo').append('<li>' + userData.Bio + ' </li>');
            $('#ProfilePhoto').attr("src", userData.ProfilePhoto);               
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch user data", error);
        }
    });
}

function AddPost(post) {
    var postHTML = '<li>' +
        '<a class="strip" href="' + post.PostPhoto + '" title="' + post.title + '" data-strip-group="mygroup" data-strip-group-options="loop: false">' +
        '<img src="' + post.PostPhoto + '" alt="' + post.title + '" height="212" width="212">' +
        '</a>' +
        '</li>';
    return postHTML;
}

function loadUserPosts() {
    var userId = sessionStorage.getItem('UserProfileId');
    var count = 0;
    $.ajax({
        url: '/api/WebApi/UserPosts/' + userId,
        method: 'GET',
        success: function (data) {
            console.log("91");
            var postsHTML = '';
            data.reverse().forEach(function (post) {
                if (post.UserId == userId) {
                    if (post.Status == 0) {
                        count++;
                        postsHTML += AddPost(post);
                    }
                }
            });
            if (count == 0) {
                postsHTML = '<li>No Post Found</li>';
            }
            $('#UserProfileDiv ul.photos').html(postsHTML);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function GetFriend(friend) {
    return `<li>
        <div class="nearly-pepls" data-user-id="${friend.UserId}">           
            <figure>
                <img src="${friend.ProfilePhoto}" alt="">
            </figure>           
                <div class="pepl-info">
                <h4>${friend.FirstName} ${friend.LastName}</h4>                 
            </div>
            <div>                
            </div>
        </div>
    </li>`;
}

function GetFriendList() {
    const userId = sessionStorage.getItem('UserProfileId');
    var friendcount = 0;
    $.ajax({
        url: '/api/WebApi/GetAllUser/' + userId,
        method: 'GET',
        success: function (data) {
            const nearbyContct = $('.nearby-contct');
            nearbyContct.empty();
            data.forEach(friend => {
                if (friend.RequestStatus === 'accepted') {
                    friendcount++;
                    nearbyContct.append(GetFriend(friend));
                }
            });

            if (friendcount == 0) {
                nearbyContct.append('<li>No Friends Found</li>');
            }

            $('#friendcount').text(friendcount + ' Friends');
            $('.nearly-pepls').click(ShowUserProfile);
        },
        error: function (error) {
            console.log('Error fetching friend list:', error);
        }
    });
}


