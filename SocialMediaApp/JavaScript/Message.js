//function loadusermessage() {
//    $.ajax({
//        url: '/api/WebApi/GetAllUser',
//        method: 'GET',
//        success: function (userinfo) {
//            var messagesHTML = '';
//            userinfo.forEach(function (user) {
//                var messageHTML =
//                    `<div class="messages">
//                        <h5 class="f-title"><i class="ti-bell"></i>All Messages </h5>
//                        <div class="message-box">
//                            <ul class="peoples">                     
//                                <li>
//                                    <figure><img src="/images/resources/friend-avatar8.jpg" alt="">
//                                        <span class="status f-online"></span>
//                                    </figure>
//                                    <li>${user.UserId}</li>
//                                    <div class="people-name">
//                                        <span>${user.LastName} ${user.FirstName}</span>
//                                    </div>
//                                </li>
//                            </ul>
//                            <div class="peoples-mesg-box">
//				    		    <figure><img src="/images/resources/friend-avatar.jpg" alt=""></figure>
//				    		    <span>jason bourne <i>online</i></span>

//				    		    <ul class="chatting-area">

//				    		    	<li class="me">
//				    		    		<figure><img src="/images/resources/userlist-1.jpg" alt=""></figure>
//				    		    		<p>i know him 5 years ago</p>
//				    		    	</li>
//				    		    	<li class="you">
//				    		    		<figure><img src="/images/resources/userlist-2.jpg" alt=""></figure>
//				    		    		<p>coooooooooool dude ;)</p>
//				    		    	</li>
//				    		    </ul>
//                            </div>
//				    		<div class="message-text-container">
//				    			<form method="post">
//				    				<textarea></textarea>
//				    				<button title="send"><i class="fa fa-paper-plane"></i></button>
//				    			</form>
//				    		</div>
//				    	</div>
//				    </div>
//                </div>`;
//                messagesHTML += messageHTML;
//            });

//            $('#page-contents .loadMore').html(messagesHTML);
//        },
//        error: function (error) {
//            console.error('Error loading messages:', error);            
//        }
//    });
//}



//function loadUserPosts() {
//    $.ajax({
//        url: '/api/WebApi/UserPosts',
//        method: 'GET',
//        success: function (data) {
//            data.reverse().forEach(function (post) {
//                var postHTML =
//                    `<div class="central-meta item">
//                        <div class="user-post">
//                            <div class="friend-info">
//                                <figure>
//                                    <img src="${post.ProfilePhoto}" alt="" height="54" width="54">
//                                </figure>
//                                <div class="friend-name">
//                                    <ins>${post.FirstName} ${post.LastName}</ins>
//                                    <span>published: ${post.PostDate}</span>
//                                </div>
//                                <div class="post-meta">
//                                    <img src="${post.PostPhoto}" alt="" height="678" width="366">
//                                    <div class="we-video-info">
//                                        <ul>
//                                            <li>
//                                                <span class="views like-button" data-toggle="tooltip" title="like" data-post-id="${post.PostId}">
//                                                    ${renderLikes(post.LikeType, post.LikeCount)}
//                                                </span>                                                
//                                            </li>
//                                            <li>
//                                                <span class="comment" data-toggle="tooltip" title="comment">
//                                                    <i class="fa fa-comments-o"></i>
//                                                    <ins>${post.CommentCount}</ins>
//                                                </span>
//                                            </li>
//                                            <li>
//                                                <span class="like" data-toggle="tooltip" title="share">
//                                                    <i class="fa-solid fa-share"></i>
//                                                    <ins>${post.ShareCount}</ins>
//                                                </span>
//                                            </li>
//                                        </ul>
//                                    </div>
//                                    <div class="description">
//                                        <p>${post.PostContent}</p>
//                                    </div>
//                                    <div class="comment-area">
//                                        <ul class="we-comet"></ul>
//                                        <div class="post-comt-box">
//                                            <textarea placeholder="Post your comment"></textarea>
//                                            <button class="btn-primary" id="Postbtn">submit</button>
//                                        </div>
//                                    </div>
//                                </div>
//                            </div>
//                        </div>
//                    </div>`;

//                $('#page-contents .loadMore').append(postHTML);

//                loadPostComments(post.PostId, $('.we-comet:last'));
//            });


//            $('.like-button').click(function () {
//                var $this = $(this);
//                var postId = $this.data('post-id');
//                var user = sessionStorage.getItem('userId');
//                var emojiDropdown = $('<div class="emoji-dropdown"></div>');
//                var emojis = ['😀', '😍', '😂', '😎', '😘'];

//                $this.find('#like').remove();

//                emojis.forEach(function (emoji, index) {
//                    var emojiElement = $('<span class="emoji-item" data-emoji-id="' + (index + 1) + '">' + emoji + '</span>');

//                    emojiElement.click(function () {
//                        var emojiId = index + 1;

//                        $.ajax({
//                            url: '/api/WebApi/LikePost',
//                            method: 'POST',
//                            data: JSON.stringify({ postId: postId, userId: user, likeType: emojiId }), 
//                            contentType: 'application/json',
//                            success: function (data) {
//                                console.log(emojiId);
//                                var newLikeButton = $('<span class="views like-button" data-toggle="tooltip" title="like" data-post-id="' + postId + '">' + emoji + '<ins>' + data.likeCount + '</ins></span>');
//                                $this.html(newLikeButton);

//                                emojiDropdown.remove();

//                            },
//                            error: function (error) {
//                                console.log(error);
//                            }
//                        });
//                    });
//                    emojiDropdown.append(emojiElement);
//                });

//                $this.append(emojiDropdown);
//            });

//            $('.post-comt-box button').click(UploadComment);
//        },
//        error: function (error) {
//            console.log(error);
//        }
//    });
//}

//function renderLikes(likeTypes, likeCount) {
//    var emojis = ['😀', '😍', '😂', '😎', '😘'];
//    var emojiCounts = {};

//    likeTypes.forEach(function (likeType) {
//        emojiCounts[likeType] = emojiCounts[likeType] ? emojiCounts[likeType] + 1 : 1;
//    });

//    var emojisHTML = 'like';
//    for (var emojiId in emojiCounts) {
//        if (emojiCounts.hasOwnProperty(emojiId)) {
//            var emojiCount = emojiCounts[emojiId];
//            if (emojiCount > 0) {
//                var emoji = emojis[emojiId - 1];
//                emojisHTML += `<span class="emoji">${emoji} <span class="emoji-count">${emojiCount}</span></span>`;
//            }
//        }
//    }
//    return emojisHTML;
//}

//-------------------------------------------------------------
//2-5-2024
//function loadmessage() {
//    const messageHTML = `<div class="messages">
//        <h5 class="f-title"><i class="ti-bell"></i>All Messages </span></h5>
//        <div class="message-box">
//            <ul class="peoples" data-ps-id="0116abdc-edc6-eee3-90c9-027771fcbcab" id="peoples">
//            </ul>
//            <div class="peoples-mesg-box">
//                <div class="conversation-head">
//                    <figure><img src="images/resources/friend-avatar.jpg" alt=""></figure>
//                    <span></span>
//                </div>
//                <ul class="chatting-area" style="height: 500px" id="chatting-area">
//                </ul>
//                <div class="message-text-container">
//                    <textarea id="message"></textarea>
//                    <button id="send" class="btn" onclick='SendMessage()'><i class="fa fa-paper-plane"></i></button>
//                </div>
//            </div>
//        </div>
//    </div>`;
//    $('.messages').html(messageHTML);   
//}

//function SendMessage() {
//    debugger;
//    var message = document.getElementById('message').value;
//    console.log(message);
//}

//function loadMessages(friendId) {
//    const userId = sessionStorage.getItem('userId');
//    $.ajax({
//        url: '/api/WebApi/GetMessages',
//        method: 'GET',
//        data: { senderId: userId, receiverId: friendId },
//        success: function (messages) {
//            const chattingArea = $('#chatting-area');
//            chattingArea.empty();
//            messages.forEach(function (message) {
//                const isSentByMe = message.SenderId === userId;
//                const messageHTML = `
//                    <li class="${isSentByMe ? 'me' : 'friend'}">
//                        <figure><img src="${isSentByMe ? 'images/resources/userlist-1.jpg' : 'images/resources/friend-avatar.jpg'}" alt=""></figure>
//                        <p>${message.MessageText}</p>
//                    </li>
//                `;
//                chattingArea.append(messageHTML);
//            });
//            chattingArea.scrollTop(chattingArea[0].scrollHeight);
//        },
//        error: function (error) {
//            console.log(error);
//        }
//    });
//}

//function loadPeopleList() {
//    const userId = sessionStorage.getItem('userId');
//    $.ajax({
//        url: '/api/WebApi/GetAllUser/' + userId,
//        method: 'GET',
//        success: function (data) {
//            console.log(data);
//            var peopleList = $('#peoples');
//            peopleList.empty();
//            if (data.length === 0) {
//                peopleList.append('<li>No users found.</li>');
//            } else {
//                data.forEach(function (user) {
//                    var userHTML = `
//                        <li data-user-id="${user.UserId}">
//                            <figure>
//                                <img src="${user.profilephoto}" height="34" width="34">
//                                <span class="status f-online"></span>
//                            </figure>
//                            <div class="people-name">
//                                <span>${user.FirstName} ${user.LastName}</span>
//                                <span hidden>${user.UserId}</span>
//                            </div>
//                        </li>
//                    `;
//                    peopleList.append(userHTML);
//                });

//                $('#peoples li').click(function () {
//                    const userId = $(this).data('user-id');
//                    const userName = $(this).find('.people-name span').first().text();
//                    const conversationHead = $('.conversation-head');
//                    conversationHead.find('span').text(userName);
//                });
//            }
//        },
//        error: function (error) {
//            console.log(error);
//        }
//    });
//}