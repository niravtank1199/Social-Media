$(document).ready(function() {

    var userId = getCookie('userId');
   
    if (userId == null) {
        //if (window.location.pathname === "/SMF/HomePage" || window.location.pathname == "/SMF/aboutpage" || window.location.pathname == "/SMF/AboutPage" ) {
        //    console.log('User not logged in. Redirecting to login page.');
            window.location.href = "/SMF/Login";
        //}      
    } else {
        console.log('User ID:', userId);
    }

    loadUserPosts();
    populateUserData(userId);
    setInterval(FriendList, 5000);
    GetFriendList();
    ShowStory();

    $('.messages').hide();

    $('#HomePage').click(function () {
        $('.loadMore').show();
        $('.Notifition').empty().hide();
        $('.friend').empty().hide();
        $('.storyContainer').show();
        $('.central-meta').show();
        loadUserPosts();
        FriendList();
    });

    $('#message').click(function () {
        $('.loadMore').hide();
        $('.messages').html(displayNotifications()).show();
        $('.friend').empty().hide();
        $('.storyContainer').hide();
        $('.central-meta').hide();
        $('.Notifition').empty().show();
    }); 

    $('#frends').click(function () {
        console.log("friend list");
        $('.loadMore').hide();
        $('.friend').html(GetFriendList()).show();
        $('.messages').empty().hide();
    });

    $("#logoutButton").click(function () {
        setCookie('userId', '', -1);
        sessionStorage.removeItem('userId');
        console.log('Logging out. Redirecting to login page.');
        location.reload();
    });

    $('#updateButton').click(updateUserInfo);
    $('#changePasswordButton').click(changePassword);
    $('form').submit(function (event) {
        event.preventDefault();
        UploadPost();
    });

    // Personal Info
    $('#timeline-link').click(function () {
        $('#timeline-div').show();
        $('#editinfo-div').hide();
        $('#changepassword-div').hide();
        $('#UserPost-div').hide();
        $('#Post-div').hide();
        $('#archieve-div').hide();

        $('#editinfo-link').removeClass('active');
        $('#timeline-link').addClass('active');
        $('#changepassword-link').removeClass('active');
        $('#FriendList-link').removeClass('active');
        $('#UserPost-link').removeClass('active');
        $('#archieve-link').removeClass('active');
    });

    //Edit Info
    $('#editinfo-link').click(function () {
        $('#timeline-div').hide();
        $('#editinfo-div').show();
        $('#changepassword-div').hide();
        $('#UserPost-div').hide();
        $('#Post-div').hide();
        $('#archieve-div').hide();
        
        $('#timeline-link').removeClass('active');
        $('#editinfo-link').addClass('active');
        $('#changepassword-link').removeClass('active');
        $('#FriendList-link').removeClass('active');
        $('#UserPost-link').removeClass('active');
        $('#archieve-link').removeClass('active');
    });

    //Change Password
    $('#changepassword-link').click(function () {
        $('#timeline-div').hide();
        $('#editinfo-div').hide();
        $('#UserPost-div').hide();
        $('#changepassword-div').show();
        $('#Post-div').hide();
        $('#archieve-div').hide();

        $('#timeline-link').removeClass('active');
        $('#editinfo-link').removeClass('active');
        $('#FriendList-link').removeClass('active');
        $('#changepassword-link').addClass('active');
        $('#UserPost-link').removeClass('active');
        $('#archieve-link').removeClass('active');
    });

    //Friend List
    $('#FriendList-link').click(function () {
        $('#UserPost-div').show();
        $('#editinfo-div').hide();
        $('#archieve-div').hide();
        $('#changepassword-div').hide();
        $('#timeline-div').hide();
        $('#Post-div').hide();

        $('#editinfo-link').removeClass('active');
        $('#FriendList-link').addClass('active');
        $('#changepassword-link').removeClass('active');
        $('#timeline-link').removeClass('active');
        $('#UserPost-link').removeClass('active');
        $('#archieve-link').removeClass('active');
    });

    //Post
    $('#UserPost-link').click(function () {
        loadUserPostsHomePage();
        $('#timeline-div').hide();
        $('#editinfo-div').hide();
        $('#changepassword-div').hide();
        $('#UserPost-div').hide();
        $('#Post-div').show();
        $('#archieve-div').hide();

        $('#timeline-link').removeClass('active');
        $('#editinfo-link').removeClass('active');
        $('#changepassword-link').removeClass('active');
        $('#FriendList-link').removeClass('active');
        $('#UserPost-link').addClass('active');
        $('#archieve-link').removeClass('active');      
    });

    //archievepost
    $('#archieve-link').click(function () {
        loadarchievepost();
        $('#archieve-div').show();
        $('#timeline-div').hide();
        $('#editinfo-div').hide();
        $('#changepassword-div').hide();
        $('#UserPost-div').hide();
        $('#Post-div').hide();

        $('#timeline-link').removeClass('active');
        $('#editinfo-link').removeClass('active');
        $('#changepassword-link').removeClass('active');
        $('#FriendList-link').removeClass('active');
        $('#UserPost-link').removeClass('active');
        $('#archieve-link').addClass('active');       
    });

    $(document).on('click', '.fa-ellipsis', function () {
        $(this).siblings('.comment-options').toggle();
    });

    $(document).on('click', '.delete-comment-btn', function () {
        var commentId = $(this).closest('li').find('span[hidden]').text();
        var $comment = $(this).closest('li');
        DeleteComment(commentId, $comment);
    });

    $(document).on('click', '.delete-reply-btn', function () {
        var commentId = $(this).closest('li').find('i[hidden]').text();
        var $reply = $(this).closest('li');
        DeleteComment(commentId, $reply);
    });

    $(document).on('click', '.post-ellipsis', function (event) {
        event.stopPropagation();
        $(this).closest('.friend-info').find('.post-options').toggle();
    });

    $(document).on('click', '.btn-danger.delete-post-btn', function () {
        var postId = $(this).closest('.central-meta').find('.like-button').data('post-id');
        deletePost(postId);
    });

    document.getElementById('storyUpload').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const storyList = document.querySelector('.storyList');
                const newStoryItem = document.createElement('div');
                newStoryItem.className = 'storyItem';

                const storyProfile = document.createElement('div');
                storyProfile.className = 'storyProfile';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Story';

                storyProfile.prepend(img);
                newStoryItem.prepend(storyProfile);

                storyList.prepend(newStoryItem);

                uploadstory(file);
            }
            reader.readAsDataURL(file);
        }
    });

    $('#TxtUserId').on('input', function () {
        $("#TxtUserId").text("");
    });
    $('#TxtLastName').on('input', function () {
        $("#TxtLastName").text("");
    });
    $('#TxtFirstName').on('input', function () {
        $("#TxtFirstName").text("");
    });
    $('#TxtCity').on('input', function () {
        $("#TxtCity").text("");
    });
    $('#TxtEmail').on('input', function () {
        $("#TxtEmail").text("");
    });
    $('#TxtPhoneNumber').on('input', function () {
        $("#TxtPhoneNumber").text("");
    });
    $('#TxtBio').on('input', function () {
        $("#TxtBio").text("");
    });
    $('#TxtUserPassword').on('input', function () {
        $("#TxtUserPassword").text("");
    });
    $('#BirthDate').on('input', function () {
        $("#BirthDate").text("");
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

function uploadstory(file) {
    const formData = new FormData();
    var userId = getCookie('userId');
    const postContent = $('#postContent').val();

    formData.append('userId', userId);
    formData.append('PostContent', postContent);
    formData.append('file', file);

    $.ajax({
        url: '/api/WebApi/AddNewStory',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {            
            console.log("added");
            ShowStory();
        },
        error: function (error) {
           
        }
    });
}

function ShowStory() {
    $.ajax({
        url: '/api/WebApi/GetAllStory',
        type: 'GET',
        success: function (data) {
            const storyList = document.querySelector('.storyList');
            storyList.innerHTML = '';

            const currentDate = new Date();
            let unviewedStories = [];
            let viewedStories = [];

            data.reverse().forEach(function (story) {
                const storyDate = new Date(story.StoryDate);
                const timeDiff = currentDate.getTime() - storyDate.getTime();
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                if (hoursDiff <= 24) {
                    const newStoryItem = document.createElement('div');
                    newStoryItem.className = 'storyItem';
                    newStoryItem.setAttribute('data-story-id', story.StoryId);

                    const storyProfile = document.createElement('div');
                    storyProfile.className = 'storyProfile';

                    const img = document.createElement('img');
                    img.src = story.StoryImage;
                    img.alt = 'Story';

                    const postContent = document.createElement('p');
                    postContent.textContent = story.PostContent;

                    storyProfile.appendChild(img);
                    newStoryItem.appendChild(storyProfile);
                    newStoryItem.appendChild(postContent);

                    checkIfViewed(story.StoryId, newStoryItem, function (isViewed) {
                        if (isViewed) {
                            viewedStories.push(newStoryItem);
                        } else {
                            unviewedStories.push(newStoryItem);  
                        }
                        appendStories();
                    });
                }
            });

            function appendStories() {
                unviewedStories.forEach(function (story) {
                    storyList.appendChild(story);
                });
                viewedStories.forEach(function (story) {
                    storyList.appendChild(story);
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    $('.storyList').on('click', '.storyItem', function () {
        const storyImage = $(this).find('img').attr('src');
        const storyId = $(this).data('story-id');
        showModal(storyImage, storyId);

        $(this).addClass('user-viewed');
    });
} 

function checkIfViewed(storyId, storyItem, callback) {
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/CheckIfViewed?storyId=' + storyId + '&userId=' + userId,
        type: 'GET',
        success: function (data) {
            if (data == true) {
                $(storyItem).addClass('viewed-story');
                callback(true);
            } else {
                $(storyItem).removeClass('viewed-story');
                callback(false);
            }
        },
        error: function (error) {
            console.log(error);
            callback(false);
        }
    });
}

//function ShowStory() {
//    $.ajax({
//        url: '/api/WebApi/GetAllStory',
//        type: 'GET',
//        success: function (data) {
//            const storyList = document.querySelector('.storyList');
//            storyList.innerHTML = '';

//            const currentDate = new Date();
//            data.reverse().forEach(function (story) {
//                const storyDate = new Date(story.StoryDate);
//                const timeDiff = currentDate.getTime() - storyDate.getTime();
//                const hoursDiff = timeDiff / (1000 * 60 * 60);
//                if (hoursDiff <= 24) {
//                    const newStoryItem = document.createElement('div');
//                    newStoryItem.className = 'storyItem';
                 
//                    newStoryItem.setAttribute('data-story-id', story.StoryId);

//                    const storyProfile = document.createElement('div');
//                    storyProfile.className = 'storyProfile';

//                    const img = document.createElement('img');
//                    img.src = story.StoryImage;
//                    img.alt = 'Story';

//                    const postContent = document.createElement('p');
//                    postContent.textContent = story.PostContent;

//                    storyProfile.appendChild(img);
//                    newStoryItem.appendChild(storyProfile);
//                    newStoryItem.appendChild(postContent);
//                    storyList.appendChild(newStoryItem);

//                    checkIfViewed(story.StoryId, newStoryItem); 
//                }
//            });
//        },
//        error: function (error) {
//            console.log(error);
//        }
//    });

//    $('.storyList').on('click', '.storyItem', function () {
//        const storyImage = $(this).find('img').attr('src');
//        const storyId = $(this).data('story-id');
//        showModal(storyImage, storyId);

//        $(this).addClass('user-viewed');
//    });
//}

//function checkIfViewed(storyId, storyItem) {
//    var userId = getCookie('userId');
//    $.ajax({
//        url: '/api/WebApi/CheckIfViewed?storyId=' + storyId + '&userId=' + userId,
//        type: 'GET',
//        success: function (data) {
//            if (data == true) {
//                $(storyItem).addClass('viewed-story');
//            } else {
//                $(storyItem).removeClass('viewed-story');
//            }
//        },
//        error: function (error) {
//            console.log(error);
//        }
//    });
//}

function showModal(storyImage, storyId) {
    const modal = document.getElementById('storyModal');
    const modalImg = modal.querySelector('.modal-img');
    const span = modal.querySelector('.close');
    const likeBtn = modal.querySelector('.like-btn');
    const clickedStoryItem = $(this);

    modalImg.src = storyImage;
    modal.style.display = 'block';

    span.onclick = function () {
        modal.style.display = 'none';
        clickedStoryItem.addClass('viewed');
        updateStoryview(storyId);
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            clickedStoryItem.addClass('viewed');            
            updateStoryview(storyId);
        } 
    }

    setTimeout(function () {
        modal.style.display = 'none';
        clickedStoryItem.addClass('viewed');
        updateStoryview(storyId);
    }, 5000);
}

function updateStoryview(storyId) {
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/UpdateStoryView?storyId=' + storyId + '&userid=' + userId,
        type: 'POST',
        success: function (data) {
            console.log(data);
            ShowStory();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function displayNotifications() {
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/notifications',
        method: 'get',
        success: function (data) {
            console.log("got notification data:", data);
            var notificationsHtml = '';
            data.reverse().forEach(function (notification) {
                if (notification.UserId == userId) {
                    if (notification.NotificationType != "Friend Request") {
                        notificationsHtml += `
                        <div class="notification-box">
                            <ul>
                                <li>
                                    <div style="display: flex;">
                                        <div class="notifi-meta">
                                            <div>
                                                <img src="${notification.ProfilePhoto}" style="height: 50px; width: 50px; border-radius: 50%;"></img>
                                            </div>
                                            <div style="margin-left: 20px;">
                                            <p>${notification.NotificationText}</p>
                                            <span>${getRelativeTime(notification.NotificationTimestamp)}</span>
                                            </div>                                                                                                               
                                        </div>
                                        <div>
                                            ${notification.NotificationType != "Friend Request" ? `<img src="${notification.PostPhoto}" style="height: 50px; width: 75px;"></img>` : ''}                                            
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>`;
                        $('.Notifition').html(notificationsHtml);
                    }
                }
            });            
        },
        error: function (xhr, status, error) {
            console.error("Error fetching notifications:", error);
        }
    });
}

// show user profile 
function ViewUserProfile() {
    event.preventDefault();
    var userId = $(this).data("userId");
    $.ajax({
        url: '/api/WebApi/' + userId,
        method: "Get",
        data: { userId: userId },
        success: function (response) {
            sessionStorage.setItem('UserProfileId', response.UserId);
            window.location.href = "/SMF/UserProfile";
        },
        error: function (xhr, status, error) {
            console.error("Error fetching user data:", error);
        }
    });
}

function ShowUserProfile(id) {
    event.preventDefault();
    var userId = id;
    $.ajax({
        url: '/api/WebApi/' + userId,
        method: "Get",
        data: { userId: userId },
        success: function (response) {
            sessionStorage.setItem('UserProfileId', response.UserId);
            window.location.href = "/SMF/UserProfile";
        },
        error: function (xhr, status, error) {
            console.error("Error fetching user data:", error);
        }
    });
}

////for add new post
function AddPost(post) {
    var userId = getCookie('userId');
    var isLikedClass = post.IsLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
    return `<div class="central-meta item">
                <div class="user-post">
                    <div class="friend-info">
                       <div id="Posthead">
                            <figure>
                                <img src="${post.ProfilePhoto}" alt="" height="54" width="54" style="border-radius: 50%">
                            </figure>
                            <div class="friend-name">
                                <div class="friend-name">
                                    <ins onclick="ShowUserProfile(${post.UserId})" style="cursor: pointer">${post.FirstName} ${post.LastName}</ins>
                                    <span hidden>${post.UserId}</span>
                                    <span>published:- ${getRelativeTime(post.PostDate)}</span>
                                </div>
                            </div>                               
                            <div id="PostDelete">
                                    ${post.UserId == userId ? '<i class="fa-solid fa-ellipsis post-ellipsis"></i>' : ''}
                                <div class="post-options" style="display: none;">
                                    ${post.UserId == userId ? '<button class="btn btn-danger delete-post-btn">Delete</button>' : ''}
                                </div>
                            </div>
                       </div> 
                        <div class="post-meta">
                            <img src="${post.PostPhoto}" alt="" height="678" width="366">
                            <div class="we-video-info">
                                <ul>
                                    <li>                                            
                                        <span class="views like-button" data-toggle="tooltip" title="like" data-post-id="${post.PostId}">
                                            <i class="${isLikedClass}" id="like"></i> <ins>${post.LikeCount}</ins>
                                        </span>
                                    </li>
                                    <li>
                                        <span class="comment" data-toggle="tooltip" title="comment">
                                            <i class="fa fa-comments-o"></i>
                                            <ins>${post.CommentCount}</ins>
                                        </span>
                                    </li>
                                    <li>    
                                        <span class="li="tooltip" title="share" hidden>
                                            <i class="fa-solid fa-share"></i>
                                            <ins>${post.ShareCount}</ins>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div class="description">
                                <p>${post.PostContent}</p>
                            </div>
                            <div class="comment-area">
                                <ul class="we-comet"></ul>
                              
                                <div class="post-comt-box">
                                    <textarea id="commentTextarea" placeholder="Post your comment" maxlength="60" onchange="commentlenght()"></textarea>
                                    <button class="btn btn-primary" id="Postbtn">comment</button>
                                    <span id="commenterror" hidden></span>
                                </div>
                                <span id="maxLengthMessage" hidden>You have reached the maximum length.</span>
                            </div>
                            <span id="comment-error"></span>
                        </div>
                    </div> 
                </div>
            </div>
    `;
}

function commentlenght() {
    const commentTextarea = document.getElementById('commentTextarea');
    const maxLengthMessage = document.getElementById('maxLengthMessage');
    const maxLength = commentTextarea.maxLength;

    commentTextarea.addEventListener('keypress', handleKeyPress);
    commentTextarea.addEventListener('keydown', handleKeyDown);

    function handleKeyPress(event) {
        const currentLength = commentTextarea.value.length;
        if (currentLength === maxLength && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            event.preventDefault();
            maxLengthMessage.textContent = `You have reached the maximum length of ${maxLength} characters.`;
            maxLengthMessage.style.display = 'block';
        } else {
            maxLengthMessage.style.display = 'none';
        }
    }

    function handleKeyDown(event) {
        const currentLength = commentTextarea.value.length;
        if (currentLength === maxLength && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            event.preventDefault();
            maxLengthMessage.textContent = `You have reached the maximum length of ${maxLength} characters.`;
            maxLengthMessage.style.display = 'block';
        } else {
            maxLengthMessage.style.display = 'none';
        }
    }
}

//load user post
function loadUserPosts() {
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/UserPosts/' + userId,
        method: 'GET',
        success: function (data) {
            console.log("post", data.length);

            var postsHTML = '';

            if (data.length == 0) {
                $('.loadMore').text("Add Friend To Show Post");
            }
            data.reverse().forEach(function (post) {
                if (post.Status == 0) {
                    postsHTML += AddPost(post);
                }
            });

            $('#page-contents .loadMore').html(postsHTML);
            // Load comments for the post
            $('.we-comet').each(function () {
                var $this = $(this);
                var postId = $this.closest('.central-meta').find('.like-button').data('post-id');
                loadPostComments(postId, $this);
            });            

            $('.like-button').click(function () {
                var $this = $(this);
                var postId = $this.data('post-id');
                $.ajax({
                    url: '/api/WebApi/LikePost',
                    method: 'POST',
                    data: { postId: postId, userId: userId },
                    success: function (data) {
                        console.log("likeddd-----" + data.isLiked);
                        $this.find('ins').text(data.likeCount);
                        if (data.isLiked) {
                            $this.find('i').removeClass('fa-regular fa-heart ').addClass('fa-solid fa-heart liked');
                        } else {
                            $this.find('i').removeClass('fa-solid fa-heart liked').addClass('fa-regular fa-heart');
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            });

            $('.friend-name').click(ShowUserProfile);

            $('.post-comt-box button').click(UploadComment);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function UploadPost() { 
    const fileInput = document.getElementById('userpost');
    const file = fileInput.files[0];
    var userId = getCookie('userId');
    const postContent = $('#postContent').val();
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('PostContent', postContent);
    if (file) {
        formData.append('file', file);
    }
    $.ajax({
        url: '/api/WebApi/AddNewPost',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#userpost").val("");
            $("#postContent").val("");
            $.ajax({
                url: '/api/WebApi/GetLastPost',
                type: 'GET',
                success: function (data) {
                    data.forEach(function (post) {
                        $('#page-contents .loadMore').prepend(AddPost(post));
                    });
                    $('.like-button').click(function () {
                        var $this = $(this);
                        var postId = $this.data('post-id');
                        var user = getCookie('userId');
                        $.ajax({
                            url: '/api/WebApi/LikePost',
                            method: 'POST',
                            data: { postId: postId, userId: user },
                            success: function (data) {
                                console.log("likes:----" + data);
                                $this.find('ins').text(data.likeCount);
                                if (data.isLiked) {
                                    $this.find('i').removeClass('fa-regular fa-heart').addClass('fa-solid fa-heart liked');
                                } else {
                                    $this.find('i').removeClass('fa-solid fa-heart liked').addClass('fa-regular fa-heart');
                                }
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    });
                    $('.post-comt-box button').click(UploadComment);
                },
                error: function (xhr, status, error) {
                    Posterror.textContent = "Photo Not Uplaod";
                    console.error("Post Not added", error);
                }
            })
        },
        error: function (xhr, status, error) {
            Posterror.textContent = "Select Photo";
            console.error("Post Not added", error);
        }
    });
}
    
function deletePost(postId) {
    $.ajax({
        url: '/api/WebApi/Deletepost/' + postId,
        method: 'put',
        success: function (data) {
            $(`.like-button[data-post-id="${postId}"]`).closest('.central-meta.item').hide();
            console.log("deleted");
        },

        error: function (error) {
        }
    });
}

function getRelativeTime(dateString) { 
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//show replies 
function ShowReplies(replies) {
    var userId = getCookie('userId');
    let replyHTML = '';
    if (replies && replies.length > 0) {
        replies.forEach(function (reply) {
            if (reply.IsDelete != 1) {
                replyHTML += `<li class="reply-item">
                <div class="comet-avatar">
                    <img src="${reply.ProfilePhoto}" alt="" height="45" width="45">
                </div>
                <div class="we-comment">
                    <div class="coment-head">
                        <h5 onclick="ShowUserProfile(${reply.UserId})" style="cursor: pointer">${reply.UserName}</h5>
                        <span>${getRelativeTime(reply.CommentDate)}</span>
                        <i hidden>${reply.CommentId}</i>
                        ${reply.UserId == userId ? '<i class="fa-solid fa-ellipsis"></i>' : '' }
                        <div class="comment-options" style="display: none;">
                            <button class="btn btn-danger delete-reply-btn">Delete</button>
                        </div>
                    </div>   
                    <p>${reply.CommentText}</p>
                </div>
            </li>`;
            }
        });
    }
    //comment repalt delete  
    return replyHTML;
}

////load all post comments
function loadPostComments(postId, $commentsList) {
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/GetPostComments?postId=' + postId + '&userId=' + userId,
        method: 'GET',
        success: function (comments) {
            $commentsList.empty();
            if (comments.length === 0) {
                $commentsList.append('<li id="NoComments">No comments yet.</li>');
            } else {
                $commentsList.find('#NoComments').remove();
                comments.forEach(function (comment) {
                    if (comment.IsDelete != 1) {
                        var commentHTML = `<li>
                        <div class="comet-avatar">
                            <img src="${comment.ProfilePhoto}" alt="" height="45" width="45">
                        </div>
                        <div class="we-comment">
                            <div class="coment-head">
                                 <h5 onclick="ShowUserProfile(${comment.UserId})" style="cursor: pointer">${comment.UserName}</h5>
                                <span>${getRelativeTime(comment.CommentDate)}</span>
                                <span hidden>${comment.CommentId}</span>
                                <i class="fa-solid fa-share" hidden></i>
                                <i class="fa-solid fa-reply"></i>
                                ${comment.UserId == userId ? '<i class="fa-solid fa-ellipsis comment-ellipsis"></i>' : ''}
                                <i class="${comment.LikedByUser ? 'fa-solid fa-heart liked' : 'fa-regular'} fa-heart comment-like-btn"></i>
                                <span>${comment.LikeCount}</span>
                                <div class="comment-options" style="display: none;">
                                    <button class="btn btn-danger delete-comment-btn">Delete</button>
                                </div>
                            </div>
                            <p>${comment.CommentText}</p>
                        </div>

                        <ul class="reply-list">                            
                                ${ShowReplies(comment.Replies)}
                        </ul>

                        <div id="replyModal" class="modal">
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h3>Reply to Comment</h3>
                                <textarea id="replyText" placeholder="Enter your reply" maxlength="50"></textarea>
                                <button class="btn btn-success" id="submitReply">Reply Comment</button>
                            </div>
                        </div>
                    </li>`;
                        $commentsList.append(commentHTML);
                    }
                });

                $commentsList.find('.fa-reply').click(function () {
                    var commentId = $(this).closest('li').find('span[hidden]').text();
                    replieComment(commentId, postId);
                });

                $commentsList.find('.comment-like-btn').click(function () {
                    var commentId = $(this).closest('li').find('span[hidden]').text();
                    commentlike(commentId);
                });

                $commentsList.find('.delete-reply-btn').click(function () {
                    var commentId = $(this).closest('li').find('i[hidden]').text();
                    var $reply = $(this).closest('li');
                    DeleteComment(commentId, $reply);
                });

                $commentsList.find('.comment-ellipsis').click(function (event) {
                    event.stopPropagation();
                    $(this).siblings('.comment-options').toggle();
                });

                $commentsList.find('.delete-comment-btn').click(function () {
                    var commentId = $(this).closest('li').find('span[hidden]').text();
                    var $comment = $(this).closest('li');
                    DeleteComment(commentId, $comment);
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

////add reply comment to db
function addCommentReply(replyText, postId, parentCommentId, userId) {
    var username = sessionStorage.getItem('Username');
    var ProfilePhoto = sessionStorage.getItem('ProfilePhoto');

    $.ajax({
        url: '/api/WebApi/AddComment',
        method: 'POST',
        data: {
            postId: postId,
            userId: userId,
            commentText: replyText,
            parentCommentId: parentCommentId
        },
        success: function (data) {
            $.ajax({
                url: '/api/WebApi/GetLastComment',
                type: 'GET',
                success: function (data) {
                    data.forEach(function (comment) {
                        var $parentComment = $(`li span[hidden]:contains(${parentCommentId})`).closest('li');
                        var $replyList = $parentComment.find('.reply-list');

                        var replyHTML = `<li class="reply-item">
                            <div class="comet-avatar">
                                <img src="${ProfilePhoto}" alt="" height="45" width="45">
                            </div>
                            <div class="we-comment">
                                <div class="coment-head">
                                    <h5>${username}</h5>
                                    <span>${getRelativeTime(comment.CommentDate)}</span>
                                    <i hidden>${comment.CommentId}</i>
                                    ${comment.UserId == userId ? '<i class="fa-solid fa-ellipsis"></i>' : ''}
                                    <div class="comment-options" style="display: none;">
                                        <button class="btn btn-danger delete-reply-btn">Delete</button>
                                    </div>
                                </div>
                                <p>${comment.CommentText}</p>
                            </div>
                        </li>`;
                        $replyList.append(replyHTML);

                        var $centralMeta = $parentComment.closest('.central-meta');
                        var $commentCount = $centralMeta.find('.comment ins');
                        var currentCount = parseInt($commentCount.text());
                        $commentCount.text(currentCount + 1);

                        $replyList.find('.delete-reply-btn').click(function () {
                            var commentId = $(this).closest('li').find('i[hidden]').text();
                            var $reply = $(this).closest('li');
                            DeleteComment(commentId, $reply);
                        });

                        $replyList.find('.fa-ellipsis').click(function () {
                            console.log('hii');
                            $(this).next('.comment-options').toggle();
                        });
                    });
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
        error: function (error) {
            console.log('Error adding new reply:', error);
        }
    });
}

function commentlike(commentId) {
    var userId = getCookie('userId');
    const $likeBtn = $('span[hidden]:contains("' + commentId + '")').siblings('.comment-like-btn');
    const $likeCount = $likeBtn.next('span');
    const isLiked = $likeBtn.hasClass('fa-solid');

    if (!isLiked) {
        $.ajax({
            url: '/api/WebApi/LikeComment',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ UserId: userId, CommentId: commentId }),
            success: function (response) {
                console.log("comment liked");                
                    let count = parseInt($likeCount.text());
                    count++;
                    $likeCount.text(count);
                $likeBtn.removeClass('fa-regular fa-heart').addClass('fa-solid fa-heart liked');
            },
            error: function (error) {
                console.log(error);
            }
        });
    } else {
        $.ajax({
            url: '/api/WebApi/UnlikeComment',
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ UserId: userId, CommentId: commentId }),
            success: function (response) {
                console.log("comment unliked");
                    let count = parseInt($likeCount.text());
                    count--;
                $likeCount.text(count); 
                $likeBtn.removeClass('fa-solid fa-heart liked').addClass('fa-regular fa-heart');
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

//show model to replies chat
function replieComment(commentId, postId) {
    var userId = getCookie('userId');
    var modal = document.getElementById("replyModal");
    var replyText = document.getElementById("replyText");
    var submitReply = document.getElementById("submitReply");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
        $('#replyText').focus();
    }

    window.onclick = function (event) {
        if (event.target == modal) { 
            $('#replyText').focus();
            modal.style.display = "none";
        }
    }

    submitReply.onclick = function () {
        var replyTextValue = replyText.value.trim();
        if (replyTextValue !== '') {
            addCommentReply(escapeHtml(replyTextValue), postId, commentId, userId);
            modal.style.display = "none";
            replyText.value = "";
        }
    }
}

////upload comment
function UploadComment() {
    var $form = $(this).closest('.post-comt-box');
    var postId = $form.closest('.central-meta').find('.like-button').data('post-id');
    var commentText = $form.find('textarea').val();
    var userId = getCookie('userId');
    var username = sessionStorage.getItem('Username');
    var ProfilePhoto = sessionStorage.getItem('ProfilePhoto');    
    
    if (commentText.trim() !== '') {
        $.ajax({
            url: '/api/WebApi/AddComment',
            method: 'POST',
            data: { postId: postId, userId: userId, commentText: escapeHtml(commentText) },
            success: function (data) {
                $.ajax({
                    url: '/api/WebApi/GetLastComment',
                    type: 'GET',
                    success: function (data) {
                        data.forEach(function (comment) {
                            console.log("new comment:- " + comment.commentText);
                            $form.find('textarea').val('');
                            var commentHTML =
                                `<li>
                                    <div class="comet-avatar">
                                        <img src="${ProfilePhoto}" alt="" height="45" width="45">
                                    </div>
                                    <div class="we-comment">
                                        <div class="coment-head">
                                            <h5>${username}</h5>
                                            <span>${getRelativeTime(comment.CommentDate)}</span>
                                            <span hidden>${comment.CommentId}</span>
                                            <i class="fa-solid fa-replay" hidden></i>
                                        <i class="fa-solid fa-reply"></i>
                                            ${comment.UserId == userId ? '<i class="fa-solid fa-ellipsis comment-ellipsis"></i>' : ''}
                                            <i class="${comment.LikedByUser ? 'fa-solid' : 'fa-regular'} fa-heart comment-like-btn"></i>
                                            <span>${comment.LikeCount}</span>
                                            <div class="comment-options" style="display: none;">
                                                <button class="btn btn-danger delete-comment-btn">Delete</button>
                                            </div>
                                        </div>
                                     <p>${comment.CommentText}</p>

                                    </div>

                                    <ul class="reply-list">
                                        ${ShowReplies(comment.Replies)}
                                    </ul>

                                    <div id="replyModal" class="modal">
                                        <div class="modal-content">
                                            <span class="close">&times;</span>
                                            <h3>Reply to Comment</h3>
                                            <textarea id="replyText" placeholder="Enter your reply"></textarea>
                                            <button class="btn btn-success" id="submitReply">Reply Comment</button>
                                        </div>
                                    </div>
                                </li>`;
                            $form.closest('.comment-area').find('.we-comet').prepend(commentHTML);

                            var $commentCount = $form.closest('.central-meta').find('.comment ins');
                            var currentCount = parseInt($commentCount.text());
                            $commentCount.text(currentCount + 1);

                            $(document).on('click', '.fa-ellipsis', function () {
                                $(this).siblings('.comment-options').toggle();
                            });

                            $(document).on('click', '.delete-comment-btn', function () {
                                var commentId = $(this).closest('li').find('span[hidden]').text();
                                var $comment = $(this).closest('li');
                                DeleteComment(commentId, $comment);
                            });
                            $(document).on('click', '.fa-reply', function () {
                                var commentId = $(this).closest('li').find('span[hidden]').text();
                                replieComment(commentId, postId);
                            });

                            $(document).on('click', '.comment-like-btn', function () {
                                var commentId = $(this).closest('li').find('span[hidden]').text();
                                commentlike(commentId);
                            });

                            $(document).on('click', '.comment-ellipsis', function (event) {
                                event.stopPropagation();
                                $(this).siblings('.comment-options').toggle();
                            });
                        });
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    } else {
        $('#comment-error').append("Enter Text");
    }
}

////delete comment
function DeleteComment(commentId, $comment) {
    $.ajax({
        url: '/api/WebApi/DeleteComments/' + commentId,
        method: 'DELETE',
        success: function (data) {
            console.log("Comment Deleted");
            var isReply = $comment.hasClass('reply-item');
            var $commentArea = $comment.closest('.comment-area');
            var $centralMeta = $commentArea.closest('.central-meta');
            $comment.hide(0, function () {
                $(this).remove(); 
                if (!isReply) {
                    var $commentCount = $centralMeta.find('.comment ins');
                    var currentCount = parseInt($commentCount.text());
                    var $replyList = $comment.find('.reply-list');
                    var replyCount = $replyList.find('.reply-item').length;
                    $commentCount.text(currentCount - 1 - replyCount);
                } else {
                    var $parentComment = $comment.closest('li');
                    var $replyList = $parentComment.find('.reply-list');
                    var replyCount = $replyList.find('.reply-item').length - 1; 
                    var $commentCount = $centralMeta.find('.comment ins');
                    var currentCount = parseInt($commentCount.text());
                    $commentCount.text(currentCount - 1); 
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

//allpost
function AddPosts(post) {
    var postHTML = '<li class="post-item" data-post-id="' + post.PostId + '">' +
        '<img src="' + post.PostPhoto + '" alt="' + post.title + '" height="212" width="212">' +
        '<span class="post-icon"><i class="fa-regular fa-bookmark"></i></span>' +
        '</li>';

    var postElement = $(postHTML);

    postElement.find('.post-icon').click(function () {
        handlearchievepost($(this).closest('.post-item').data('post-id'));
    });
    return postElement;
}

function loadUserPostsHomePage() {
    var userId = getCookie('userId');
    var count = 0;
    $.ajax({
        url: '/api/WebApi/UserPosts/' + userId,
        method: 'GET',
        success: function (data) {
            $('#UserPostDiv ul.photos').empty();
            data.reverse().forEach(function (post) {
                if (post.Status === 1 || post.Status === 2 || post.UserId !== parseInt(userId)) {
                    return;                    
                } else {
                    count = 1;
                    var postElement = AddPosts(post);
                    $('#UserPostDiv ul.photos').append(postElement);
                }
            });
            if (count == 0) {
                var message = `No Post Found`
                $('#UserPostDiv ul.photos').append(message);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

//archievepost
function archievepost(post) {
    var postHTML = '<li class="post-item" data-post-id="' + post.PostId + '">' +
        '<img src="' + post.PostPhoto + '" alt="' + post.title + '" height="212" width="212">' +
        '<span class="post-icon"><i class="fa-solid fa-bookmark"></i></span>' +
        '</li>';

    var postElement = $(postHTML);

    postElement.find('.post-icon').click(function () {
        handlearchievepost($(this).closest('.post-item').data('post-id'));
    });

    return postElement;
}

function loadarchievepost() {
    var count = 0;
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/UserPosts/' + userId,
        method: 'GET',
        success: function (data) {
            $('#archieveDiv ul.photos').empty();
            data.reverse().forEach(function (post) {
                if (post.Status === 1 && post.UserId == userId) {
                    count = 1;
                    var postElement = archievepost(post);
                    $('#archieveDiv ul.photos').append(postElement);
                }               
            });
            if (count == 0) {
                var message = `No Data Found`
                $('#archieveDiv ul.photos').append(message);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function handlearchievepost(postId) {
    console.log("Post ID:", postId);

    var postElementInUserDiv = $('#UserPostDiv [data-post-id="' + postId + '"]');
    var postElementInArchieveDiv = $('#archieveDiv [data-post-id="' + postId + '"]');

    var postElement;
    var apiUrl;
    var successMessage;

    if (postElementInUserDiv.length > 0) {
        postElement = postElementInUserDiv;
        apiUrl = '/api/WebApi/addarchievepost/' + postId;
        console.log("Post moved to archive");
    } else if (postElementInArchieveDiv.length > 0) {
        postElement = postElementInArchieveDiv;
        apiUrl = '/api/WebApi/removearchievepost/' + postId;
        console.log("Post removed from archive");
    } else {
        console.log("Post element not found in either container");
        return;
    }

    $.ajax({
        url: apiUrl,
        method: 'PUT',
        success: function (data) {
            postElement.hide();  
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// show all user data to about page 
function populateUserData(userId) {
    $.ajax({
        url: '/api/WebApi/' + userId,
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            var userData = response;
            sessionStorage.setItem('Username', response.LastName + " " + response.FirstName);
            sessionStorage.setItem('ProfilePhoto', userData.ProfilePhoto);
            $('h5#UserName').html(userData.LastName);
            $('li#UserName').html('<i class="fa-regular fa-user"></i>' + userData.LastName);
            $('#City').html('<i class="fa-solid fa-city"></i> ' + userData.City);
            $('#PhoneNumber').html('<i class="fa-solid fa-phone"></i> ' + userData.PhoneNumber);
            $('#Email').html('<i class="fa-solid fa-envelope"></i> ' + userData.Email);
            $('#interestdata').append('<li>' + userData.Interests + ' </li>');
            $('#BioInfo').append('<li>' + userData.Bio + ' </li>');
            $('#ProfilePhoto').attr("src", userData.ProfilePhoto);
            $('#TxtUserId').val(userData.UserId);
            $('#TxtLastName').val(userData.LastName);
            $('#TxtFirstName').val(userData.FirstName);
            $('#TxtCity').val(userData.City);
            $('#TxtEmail').val(userData.Email);
            $('#TxtBio').val(userData.bio);
            $('#TxtPhoneNumber').val(userData.PhoneNumber);
            $('#TxtBio').val(userData.Bio);
            $('#TxtUserPassword').val(userData.UserPassword);
            $('#gender').val(userData.Gender);
            $('#Interests').val(userData.Interests);

            if (userData.ProfilePhoto == '') {
                $('#profilephoto').attr("src", "/images/credit-cards.png");
            } else {
                $('#profilephoto').attr("src", userData.ProfilePhoto);
            }
            
            //show Gender db value
            if (userData.Gender === 'Male') {
                $('#inlineRadio1').prop('checked', true);
            } else if (userData.Gender === 'Female') {
                $('#inlineRadio2').prop('checked', true);
            }
            //show interests db value
            var interests = userData.Interests.split(', ');
            $("input[name='Interests']").prop('checked', false);
            interests.forEach(function (interest) {
                $("input[name='Interests'][value='" + interest + "']").prop('checked', true);
            });
            //show brithdate db value
            var birthDate = new Date(userData.BirthDate);
            var year = birthDate.getFullYear();
            var month = String(birthDate.getMonth() + 1).padStart(2, '0');
            var day = String(birthDate.getDate()).padStart(2, '0');
            var formattedBirthDate = `${year}-${month}-${day}`;
            $('#BirthDate').val(formattedBirthDate);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch user data", error);
        }
    });
}

////// Function to validate form fields
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePhoneNumber(phone) {
    var re = /^\d{10}$/;
    return re.test(phone);
}

function clearErrors() {
    $('.error-message').remove();
}

function showError(element, message) {
    var errorMessage = $('<span class="error-message" style="color: red;">' + message + '</span>');
    element.after(errorMessage);
}

function isFutureDate(date) {
    var today = new Date();
    var inputDate = new Date(date);
    return inputDate > today;
}

function stripHtmlTags(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

function updateUserInfo() {
    clearErrors();

    const Interests = [];
    const checkboxes = $("input[name='Interests']:checked");
    checkboxes.each(function () {
        Interests.push($(this).val());
    });

    const userData = {
        UserId: stripHtmlTags($('#TxtUserId').val().trim()),
        LastName: stripHtmlTags($('#TxtLastName').val().trim()),
        FirstName: stripHtmlTags($('#TxtFirstName').val().trim()),
        City: stripHtmlTags($('#TxtCity').val().trim()), 
        Email: stripHtmlTags($('#TxtEmail').val().trim()),
        PhoneNumber: stripHtmlTags($('#TxtPhoneNumber').val().trim()),
        Bio: stripHtmlTags($('#TxtBio').val().trim()),
        UserPassword: stripHtmlTags($('#TxtUserPassword').val().trim()),
        Gender: stripHtmlTags($("input[name='gender']:checked").val()),
        Interests: stripHtmlTags(Interests.join(', ')),
        BirthDate: $('#BirthDate').val()
    };

    let isValid = true;

    // Validate fields
    if (!userData.UserId) {
        showError($('#TxtUserId'), 'User ID is required.');
        isValid = false;
    }
    if (!userData.LastName) {
        showError($('#TxtLastName'), 'Last Name is required.');
        isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(userData.LastName)) {
        showError($('#TxtLastName'), 'Last Name should only contain letters.');
        isValid = false;
    }
    if (!userData.FirstName) {
        showError($('#TxtFirstName'), 'First Name is required.');
        isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(userData.FirstName)) {
        showError($('#TxtFirstName'), 'First Name should only contain letters.');
        isValid = false;
    }
    if (!userData.City) {
        showError($('#TxtCity'), 'City is required.');
        isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(userData.City)) {
        showError($('#TxtCity'), 'City should only contain letters and spaces.');
        isValid = false;
    }
    if (!userData.Email || !validateEmail(userData.Email)) {
        showError($('#TxtEmail'), 'Valid Email is required.');
        isValid = false;
    }
    if (!userData.PhoneNumber || !validatePhoneNumber(userData.PhoneNumber)) {
        showError($('#TxtPhoneNumber'), 'Valid 10-digit Phone Number is required.');
        isValid = false;
    }
    if (!userData.BirthDate) {
        showError($('#BirthDate'), 'Birth Date is required.');
        isValid = false;
    } else if (isFutureDate(userData.BirthDate)) {
        showError($('#BirthDate'), 'Birth Date cannot be in the future.');
        isValid = false;
    }
    if (!userData.Gender) {
        showError($("input[name='gender']").last(), 'Gender is required.');
        isValid = false;
    }
    if (Interests.length === 0) {
        showError($("input[name='Interests']").last(), 'At least one Interest must be selected.');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    $.ajax({
        url: '/api/WebApi/' + userData.UserId,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(userData), 
        success: function (response) {
            console.log('User information updated successfully');
        },
        error: function (xhr, status, error) {
            if (xhr.status === 400) {                
                console.error('Error updating user information:', xhr.responseText);
                showError($('#TxtEmail'), "The provided email address or phone number is already in use");
                showError($('#TxtPhoneNumber'), "The provided email address or phone number is already in use");
            } else {
                console.error('Error updating user information:', error);
            }
        }
        //error: function (xhr, status, error) {
        //    console.error('Error updating user information:', error);
        //}
    });
}

//upload profile photo
function uploadProfilePhoto() {
    var userId = getCookie('userId');
    var formData = new FormData();
    var fileInput = document.getElementById('profilePhoto');
    if (fileInput.files.length > 0) {
        formData.append('profilePhoto', fileInput.files[0]);

        $.ajax({
            url: '/api/WebApi/uploadprofilephoto/' + userId,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $('#ProfilePhoto').attr('src', response.ProfilePhoto);
            },
            error: function (error) {
                console.log(error);
            }
        });
    } else {
        alert('Please select a file');
    }
}
 
//change password
function changePassword() {
    var newPassword = document.getElementById('NewPassword').value;
    var reenterNewPassword = document.getElementById('ReenterNewPassword').value;
    var currentPassword = document.getElementById('currentPassword').value;
    var userId = getCookie('userId');
    if (newPassword !== reenterNewPassword) {
        result.textContent = 'New passwords do not match';
        result.style.color = 'red';
        return;
    }

    $.ajax({
        url: '/api/WebApi/ChangeUserPassword/' + userId,
        method: 'put',
        contentType: 'application/json',
        data: JSON.stringify({
            newPassword: newPassword,
            currentPassword: currentPassword
        }),
        success: function (response) {
            result.textContent = "Password Updated";
            result.style.color = "green";
            $("#NewPassword").val("");
            $("#ReenterNewPassword").val("");
            $("#currentPassword").val("");
        },
        error: function (xhr, status, error) {
            result.textContent = 'Old Password Not Match' + error;
            result.style.color = 'red';
            console.error('Error changing password:', error);
        }
    });
}

////show friendlist 
function FriendList() {
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/GetAllUser/' + userId,
        method: 'GET',
        success: function (data) {
            var peopleList = $('#people-list');
            peopleList.empty();

            data.sort(function (a, b) {
                if (a.RequestStatus === 'pending' && b.RequestStatus !== 'pending') {
                    return -1;
                } else if (a.RequestStatus !== 'pending' && b.RequestStatus === 'pending') {
                    return 1;
                }
                return 0;
            });

            if (data.length === 0) {
                peopleList.append('<li>No users found.</li>');
            } else {
                data.forEach(function (user) {
                    if (user.RequestStatus != 'accepted') {
                        var userHTML = `
                            <li>
                                <div style="display: flex; justify-content: space-between;">
                                    <figure>
                                        <img src="${user.ProfilePhoto}" alt="" height="42" width="42">
                                    </figure>
                                    <div style="display: inline;"> 
                                    <i onclick="ShowUserProfile(${user.UserId})" style="cursor: pointer">${user.FirstName} ${user.LastName}</i>
                                        <i hidden>${user.UserId}</i>
                                    </div>
                                    <div style="display: inline;">
                                     ${user.IsFriend == 1 && user.FollowerId == userId
                                ? `<button class="btn btn-outline-danger remove-friend-btn" data-user-id="${user.UserId}">Remove</button>`
                                : user.RequestStatus === "pending"
                                    ? `<button class="btn btn-outline-primary confirm-friend-btn" data-user-id="${user.UserId}">Confirm</button>
                                                    <button class="btn btn-outline-danger remove-friend-btn" data-user-id="${user.UserId}">Remove</button>`
                                    : user.RequestStatus === "accepted"
                                        ? `<button class="btn btn-outline-danger remove-friend-btn" data-user-id="${user.UserId}">Remove</button>`
                                        : `<button class="btn btn-outline-secondary add-friend-btn" data-user-id="${user.UserId}">Add Friend</button>`
                            }
                                    </div>
                                </div>  
                            </li>
                        `;
                        peopleList.append(userHTML);
                    }
                });

                $('.add-friend-btn').on('click', function () {
                    var userId = $(this).data('user-id');
                    console.log('Add Friend button clicked for user ID:', userId);
                    addFriend(userId);
                });

                $('.remove-friend-btn').on('click', function () {
                    var userId = $(this).data('user-id');
                    console.log('Remove Friend button clicked for user ID:', userId);
                    removeFriend(userId);
                });

                $('.confirm-friend-btn').on('click', function () {
                    var userId = $(this).data('user-id');
                    console.log('Confirm Friend button clicked for user ID:', userId);
                    confirmFriendRequest(userId);
                });
            }
        },
        error: function (error) {
            console.log('Error fetching user data:', error);
        },
    });
}

//add friend
function addFriend(userId) {
    var currentUserId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/AddFriend',
        method: 'POST',
        data: {
            userId: currentUserId,
            followerId: userId
        },
        success: function (data) {
            console.log('Friend added successfully');
            FriendList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
 
//remove friend
function removeFriend(friendId) {
    var userId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/RemoveFriend',
        method: 'POST',
        data: { UserId: userId, FollowerId: friendId },
        success: function (response) {
            console.log('Friend removed successfully');
            FriendList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

//confrim freiend request
function confirmFriendRequest(userId) {
    var currentUserId = getCookie('userId');
    $.ajax({
        url: '/api/WebApi/ConfirmFriendRequest',
        method: 'POST',
        data: {
            userId: currentUserId,
            followerId: userId
        },
        success: function (data) {
            console.log('added');
            FriendList();
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
                <h4 id="Name" data-user-id="${friend.UserId}">${friend.FirstName} ${friend.LastName}</h4>
            </div>
            <div>
                <button class="btn btn-outline-danger remove-friend-btn" id="removebtn" data-user-id="${friend.UserId}" >Remove</button>
            </div>
        </div>
    </li>`; 
}

function GetFriendList() {
    var userId = getCookie('userId');
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
                $('.nearby-contct').append("Not Friend Found");
            }
            $('#friendcount').text(friendcount + ' Friends');

            $('#Name').click(ViewUserProfile);
        },
        error: function (error) {
            console.log('Error fetching friend list:', error);
        }
    });
}


//function GetFriendList() {
//    const userId = sessionStorage.getItem('userId');
//    $.ajax({
//        url: '/api/WebApi/GetAllUser/' + userId,
//        method: 'GET',
//        success: function (data) {
//            const nearbyContct = $('.nearby-contct');
//            nearbyContct.empty(); 
//            debugger;
//            data.forEach(friend => {
//                nearbyContct.append(GetFriend(friend));
//            });
//        },
//        error: function (error) {
//            console.log('Error fetching friend list:', error);
//        }
//    });
//}


//function AddPost(post) {
//    var userId = sessionStorage.getItem('userId');
//    var isLikedClass = post.IsLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';

//    return `<div class="central-meta item">
//        <div class="user-post">
//            <div class="friend-info">
//                <figure>
//                    <img src="${post.ProfilePhoto}" alt="" height="54" width="54">
//                </figure>
//                <div class="friend-name-container">
//                    <div class="friend-name">
//                        <ins>${post.FirstName} ${post.LastName}</ins>
//                        <span>published:- ${post.PostDate}</span>
//                    </div>
//                    ${post.UserId != userId ? '' : `<div class="ellipsis-container">
//                        <i class="fa-solid fa-ellipsis"></i>
//                    </div>`}
//                </div>
//            </div>
//            <div class="post-meta">
//                <img src="${post.PostPhoto}" alt="" height="678" width="366">
//                <div class="we-video-info">
//                    <ul>
//                        <li>
//                            <span class="views like-button" data-toggle="tooltip" title="like" data-post-id="${post.PostId}">
//                                <i class="${isLikedClass}" id="like"></i> <ins>${post.LikeCount}</ins>
//                            </span>
//                        </li>
//                        <li>
//                            <span class="comment" data-toggle="tooltip" title="comment">
//                                <i class="fa fa-comments-o"></i>
//                                <ins>${post.CommentCount}</ins>
//                            </span>
//                        </li>
//                        <li>
//                            <span class="like" data-toggle="tooltip" title="share" hidden>
//                                <i class="fa-solid fa-share"></i>
//                                <ins>${post.ShareCount}</ins>
//                            </span>
//                        </li>
//                    </ul>
//                </div>
//                <div class="description">
//                    <p>${post.PostContent}</p>
//                </div>
//                <div class="comment-area">
//                    <ul class="we-comet"></ul>
//                    <div class="post-comt-box">
//                        <textarea placeholder="Post your comment"></textarea>
//                        <button class="btn btn-primary" id="Postbtn">comment</button>
//                    </div>
//                </div>
//            </div>
//        </div>
//    </div>`;
//}