using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using SocialMediaApp.Context;
using SocialMediaApp.Models;
using System.Configuration;
using Newtonsoft.Json;

namespace SocialMediaApp.Controllers
{
    [RoutePrefix("api/WebApi")]
    public class WebApiController : ApiController
    {
        SocialMediaAppEntities db = new SocialMediaAppEntities();

        string connectionString = ConfigurationManager.ConnectionStrings["SocialMedia"].ConnectionString;

        [HttpGet] //sp
        [Route("login")]
        public IHttpActionResult GetUser(string email, string password)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("GetUserById", connection);
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@Email", email);
                command.Parameters.AddWithValue("@Password", password);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        User user = new User
                        {
                            UserId = Convert.ToInt32(reader["UserId"]),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            Email = reader["Email"].ToString(),
                            City = reader["City"].ToString(),
                            UserPassword = reader["UserPassword"].ToString(),
                            Gender = reader["Gender"].ToString(),
                            ProfilePhoto = reader["ProfilePhoto"].ToString(),
                            Interests = reader["Interests"].ToString(),
                            PhoneNumber = reader["PhoneNumber"].ToString(),
                            Bio = reader["Bio"].ToString(),
                        };
                        return Ok(user);
                    }
                }
                return Unauthorized();
            }
        }

        [HttpPost] //sp
        [Route("register")]
        public IHttpActionResult Register(UserData userData)
        {
            if (userData == null || string.IsNullOrEmpty(userData.Email) || string.IsNullOrEmpty(userData.UserPassword))
                return BadRequest("Invalid user data.");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand("AddUser", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Email", userData.Email);
                    command.Parameters.AddWithValue("@UserPassword", userData.UserPassword);
                    command.Parameters.AddWithValue("@LastName", userData.LastName);
                    command.Parameters.AddWithValue("@FirstName", userData.FirstName);
                    command.Parameters.AddWithValue("@ProfilePhoto", "/postupload/imange.jpg");

                    int result = command.ExecuteNonQuery();

                    if (result > 0)
                    {
                        return Ok();
                    }
                    else
                    {
                        return Conflict();
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
                finally
                {
                    connection.Close();
                }
            }
        }   


        [HttpGet] //SP
        [Route("{id}")]
        public IHttpActionResult GetUserById(int id)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    SqlCommand cmd = new SqlCommand("GetUser", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);

                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        User user = new User
                        {
                            UserId = (int)reader["UserId"],
                            LastName = reader["LastName"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            City = reader["City"].ToString(),
                            Email = reader["Email"].ToString(),
                            UserPassword = reader["UserPassword"].ToString(),
                            Gender = reader["Gender"].ToString(),
                            ProfilePhoto = reader["ProfilePhoto"].ToString(),
                            Interests = reader["Interests"].ToString(),
                            PhoneNumber = reader["PhoneNumber"].ToString(),
                            Bio = reader["Bio"].ToString(),
                            BirthDate = (DateTime)reader["BirthDate"],
                            Posts = JsonConvert.DeserializeObject<List<Post>>(reader["Posts"].ToString())
                        };
                        return Ok(user);
                    }
                    else
                    {
                        return NotFound();
                    }
                }
                catch (Exception ex)
                {
                    return InternalServerError(ex);
                }
            }

        }


        [HttpPut] //sp
        [Route("{id}")]
        public IHttpActionResult UpdateUserInfo(int id, [FromBody] UserData userData)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("UpdateUserInfo", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@FirstName", userData.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", userData.LastName);
                    cmd.Parameters.AddWithValue("@City", userData.City);
                    cmd.Parameters.AddWithValue("@UserPassword", userData.UserPassword);
                    cmd.Parameters.AddWithValue("@Email", userData.Email);
                    cmd.Parameters.AddWithValue("@Gender", userData.Gender);
                    cmd.Parameters.AddWithValue("@Interests", userData.Interests);
                    cmd.Parameters.AddWithValue("@PhoneNumber", userData.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Bio", userData.Bio);
                    cmd.Parameters.AddWithValue("@BirthDate", userData.BirthDate);

                    SqlParameter returnValue = new SqlParameter();
                    returnValue.Direction = ParameterDirection.ReturnValue;
                    cmd.Parameters.Add(returnValue);

                    cmd.ExecuteNonQuery();

                    int result = (int)returnValue.Value;

                    switch (result)
                    {
                        case -1:
                            return BadRequest("The provided email address or phone number is already in use.");
                        case -2:
                            return NotFound();
                        case 0:
                            return Ok();
                        default:
                            return InternalServerError();
                    }
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }       

        [HttpPut]
        [Route("ChangeUserPassword/{id}")]
        public IHttpActionResult ChangeUserPassword(int id, [FromBody] PasswordChangeModel model)
        {
            if (model == null || id <= 0)
            {
                return BadRequest("Invalid user data or ID.");
            }

            using (var context = new SocialMediaAppEntities())
            {
                var oldUser = context.UserDatas.FirstOrDefault(u => u.UserId == id);
                if (oldUser == null)
                {
                    return NotFound();
                }

                if (oldUser.UserPassword != model.CurrentPassword)
                {
                    return Unauthorized();
                }

                var recentPasswordChanges = context.PasswordChangeHistories
                    .Where(p => p.UserId == id)
                    .OrderByDescending(p => p.ChangeDate)
                    .Take(3)
                    .Select(p => p.NewPassword)
                    .ToList();

                if (recentPasswordChanges.Contains(model.NewPassword))
                {
                    return BadRequest("New password cannot be the same as any of the last three passwords.");
                }
                context.PasswordChangeHistories.Add(new PasswordChangeHistory
                {
                    UserId = id,
                    NewPassword = model.NewPassword,
                    ChangeDate = DateTime.Now
                });

                var allPasswordChanges = context.PasswordChangeHistories
                    .Where(p => p.UserId == id)
                    .OrderByDescending(p => p.ChangeDate)
                    .ToList();

                if (allPasswordChanges.Count > 3)
                {
                    var toRemove = allPasswordChanges.Skip(3).ToList();
                    context.PasswordChangeHistories.RemoveRange(toRemove);
                }

                oldUser.UserPassword = model.NewPassword;
                context.SaveChanges();
            }
            return Ok("Password changed successfully.");
        }
       
        [HttpPost]
        [Route("uploadprofilephoto/{id}")]
        public IHttpActionResult UploadProfilePhoto(int id)
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(postedFile.FileName);
                    var filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/postupload/"), fileName);

                    postedFile.SaveAs(filePath);

                    var userId = id ;
                    var user = db.UserDatas.Find(userId);
                    if (user != null)
                    {                        
                        user.ProfilePhoto = "/postupload/" + fileName;
                        db.SaveChanges();
                        return Ok(new { Message = "Profile photo updated successfully", ProfilePhoto = user.ProfilePhoto });
                    }
                }
            }
            return BadRequest("No file uploaded or file is empty");
        }

        [HttpPost]
        [Route("AddNewPost")]
        public IHttpActionResult AddNewPost()
        {
            var httpRequest = HttpContext.Current.Request;
            var userId = httpRequest.Form["userId"];
            var postContent = httpRequest.Form["PostContent"];

            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];

                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/postupload"), postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    string imageUrl = VirtualPathUtility.ToAbsolute("~/postupload/" + postedFile.FileName);
                    UserPost post = new UserPost
                    {
                        UserId = Convert.ToInt32(userId),
                        PostContent = postContent,
                        PostPhoto = imageUrl,
                        PostDate = DateTime.Now,
                        LikeCount = 0,
                        ShareCount = 0,
                        CommentCount = 0
                    };

                    db.UserPosts.Add(post);
                    db.SaveChanges();
                    return Ok("Post added successfully.");
                }
            }
            return BadRequest("Image file is required to add a post.");
        }
                    
        [HttpPost]
        [Route("AddNewStory")]
        public IHttpActionResult AddNewStory()
        {
            var httpRequest = HttpContext.Current.Request;
            var userId = httpRequest.Form["userId"];
            var postContent = httpRequest.Form["PostContent"];

            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];

                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/postupload"), postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    string imageUrl = VirtualPathUtility.ToAbsolute("~/postupload/" + postedFile.FileName);
                    UserStory story = new UserStory
                    {
                        UserId = Convert.ToInt32(userId),
                        StoryImage = imageUrl,
                        StoryDate = DateTime.Now,
                    };

                    db.UserStories.Add(story);
                    db.SaveChanges();
                    return Ok("story added successfully.");
                }
            }
            return BadRequest("Image file is required to add a post.");
        }

        [HttpGet] //sp
        [Route("GetAllStory")]
        public IHttpActionResult GetAllStory()
        {
            SocialMediaAppEntities appEntities = new SocialMediaAppEntities();
            var Stroy = appEntities.GetAllStory();
            return Ok(Stroy);
        }      


        [HttpPost] //sp
        [Route("UpdateStoryView")]
        public IHttpActionResult UpdateStoryView(int storyId, int userId)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("UpdateStoryView", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    cmd.Parameters.AddWithValue("@StoryId", storyId);

                    int result = cmd.ExecuteNonQuery();

                    if (result > 0)
                    {
                        return Ok("Story view updated successfully for the provided story ID");
                    }
                    else
                    {
                        return InternalServerError();
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet] //sp
        [Route("CheckIfViewed")]
        public IHttpActionResult CheckIfViewed(int storyId, int userId)
        {
            try
            {
                bool viewed = false;               
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("CheckIfViewed", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@StoryId", storyId);
                        command.Parameters.AddWithValue("@UserId", userId);

                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                viewed = reader.GetInt32(0) == 1;
                            }
                        }
                    }
                }

                return Ok(viewed);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut] //sp
        [Route("Deletepost/{id}")]
        public IHttpActionResult Deletepost(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                using (var command = new SqlCommand("DeletePostById", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Id", id));

                    connection.Open();
                    var result = command.ExecuteNonQuery();

                    if (result == 0)
                    {
                        return BadRequest("Post Not Deleted");
                    }
                }
            }
            return Ok();
        }


        [HttpPut] //sp
        [Route("addarchievepost/{id}")]
        public IHttpActionResult addarchievepost(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                using (var command = new SqlCommand("addarchievepost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Id", id));

                    connection.Open();
                    var result = command.ExecuteNonQuery();

                    if (result == 0)
                    {
                        return BadRequest("Post Not Deleted");
                    }
                }
            }
            return Ok();
        }

        [HttpPut] //sp
        [Route("removearchievepost/{id}")]
        public IHttpActionResult removearchievepost(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                using (var command = new SqlCommand("removearchievepost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Id", id));

                    connection.Open();
                    var result = command.ExecuteNonQuery();

                    if (result == 0)
                    {
                        return BadRequest("Post Not Deleted");
                    }
                }
            }
            return Ok();
        }
            
           
        [HttpGet]
        [Route("UserPosts/{userId}")]
        public IHttpActionResult GetUserPosts(int userId)
        {
          
            var userPosts = db.UserPosts
                .Where(post => post.UserId == userId)
                .Select(post => new
                {
                    PostId = post.PostId,
                    UserId = post.UserId,
                    PostContent = post.PostContent,
                    PostPhoto = post.PostPhoto,
                    PostDate = post.PostDate,
                    LikeCount = post.LikeCount,
                    ShareCount = post.ShareCount,
                    CommentCount = post.CommentCount,
                    FirstName = post.UserData.FirstName,
                    LastName = post.UserData.LastName,
                    ProfilePhoto = post.UserData.ProfilePhoto,
                    Status = post.Status,
                    IsLiked = post.PostLikes.Any(x => x.UserId == userId)
                });

            var friendPosts = db.UserPosts
                .Join(db.UserFriends.Where(f => f.IsFriend == 2 && (f.UserId == userId || f.FollowerId == userId)),
                    post => post.UserId,
                    friend => friend.UserId == userId ? friend.FollowerId : friend.UserId,
                    (post, friend) => new
                    {
                        PostId = post.PostId,
                        UserId = post.UserId,
                        PostContent = post.PostContent,
                        PostPhoto = post.PostPhoto,
                        PostDate = post.PostDate,
                        LikeCount = post.LikeCount,
                        ShareCount = post.ShareCount,
                        CommentCount = post.CommentCount,
                        FirstName = post.UserData.FirstName,
                        LastName = post.UserData.LastName,
                        ProfilePhoto = post.UserData.ProfilePhoto,
                        Status = post.Status,
                        IsLiked = post.PostLikes.Any(x => x.UserId == userId)
                    });

            var postsInfo = userPosts.Union(friendPosts);

            return Ok(postsInfo);
                       
        }


        [HttpPost] //sp
        [Route("LikePost")]
        public IHttpActionResult LikePost([FromBody] PostLike request)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (var command = new SqlCommand("LikePost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@PostId", request.PostId));
                    command.Parameters.Add(new SqlParameter("@UserId", request.UserId));

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            int likeCount = reader.GetInt32(reader.GetOrdinal("LikeCount"));
                            bool isLiked = reader.GetBoolean(reader.GetOrdinal("IsLiked"));
                            return Ok(new { likeCount, isLiked });
                        }
                    }
                }
            }

            return InternalServerError();
        }


        [HttpPost] //sp
        [Route("AddComment")]
        public IHttpActionResult AddComment(PostComment model)
        {
            if (ModelState.IsValid)
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    using (var command = new SqlCommand("AddComment", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@PostId", model.PostId));
                        command.Parameters.Add(new SqlParameter("@UserId", model.UserId));
                        command.Parameters.Add(new SqlParameter("@CommentText", model.CommentText));

                        if (model.ParentCommentId.HasValue)
                        {
                            command.Parameters.Add(new SqlParameter("@ParentCommentId", model.ParentCommentId.Value));
                        }
                        else
                        {
                            command.Parameters.Add(new SqlParameter("@ParentCommentId", DBNull.Value));
                        }

                        command.ExecuteNonQuery();
                    }
                }

                return Ok();
            }

            return BadRequest();
        }


        [HttpGet] 
        [Route("GetPostComments")]
        public IHttpActionResult GetPostComments(int postId, int userId)
        {
            var comments = db.PostComments
                .Where(c => c.PostId == postId && c.ParentCommentId == null)
                .Select(c => new
                {
                    c.CommentId,
                    c.CommentText,
                    c.CommentDate,
                    c.UserId,
                    UserName = c.UserData.FirstName + " " + c.UserData.LastName,
                    ProfilePhoto = c.UserData.ProfilePhoto,
                    ParentCommentId = c.ParentCommentId,
                    LikedByUser = c.CommentLikes.Any(cl => cl.UserId == userId),
                    LikeCount = c.LikeCount,
                    IsDelete = c.IsDeleted,
                    Replies = c.PostComments1
                        .Where(r => r.ParentCommentId == c.CommentId)
                        .Select(r => new
                        {
                            r.CommentId,
                            r.CommentText,
                            r.CommentDate,
                            r.UserId,
                            UserName = r.UserData.FirstName + " " + r.UserData.LastName,
                            ProfilePhoto = r.UserData.ProfilePhoto,
                            ParentCommentId = r.ParentCommentId,
                            LikedByUser = r.CommentLikes.Any(cl => cl.UserId == userId),
                            LikeCount = r.LikeCount,
                            IsDelete = r.IsDeleted
                        })
                        .ToList()
                })
                .AsEnumerable()
                .Select(c => new
                {
                    c.CommentId,
                    c.CommentText,
                    CommentDate = c.CommentDate,
                    c.UserId,
                    c.UserName,
                    c.ProfilePhoto,
                    c.ParentCommentId,
                    c.LikedByUser,
                    c.LikeCount,
                    c.IsDelete,
                    Replies = c.Replies
                        .Select(r => new
                        {
                            r.CommentId,
                            r.CommentText,
                            CommentDate = r.CommentDate,
                            r.UserId,
                            r.UserName,
                            r.ProfilePhoto,
                            r.ParentCommentId,
                            r.LikedByUser,
                            r.LikeCount,
                            r.IsDelete
                        })
                        .ToList()
                })
                .ToList();
            return Ok(comments);
        }


        [HttpGet] //sp
        [Route("GetCommentReplies/{parentCommentId}")]
        public IHttpActionResult GetCommentReplies(int parentCommentId)
        {
            //not use
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (var command = new SqlCommand("GetCommentReplies", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ParentCommentId", parentCommentId));

                    using (var reader = command.ExecuteReader())
                    {
                        var replies = new List<object>();

                        while (reader.Read())
                        {
                            var reply = new
                            {
                                CommentId = reader.GetInt32(reader.GetOrdinal("CommentId")),
                                CommentText = reader.GetString(reader.GetOrdinal("CommentText")),
                                CommentDate = reader.GetDateTime(reader.GetOrdinal("CommentDate")),
                                UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                                UserName = reader.GetString(reader.GetOrdinal("UserName")),
                                ProfilePhoto = reader.IsDBNull(reader.GetOrdinal("ProfilePhoto")) ? null : reader.GetString(reader.GetOrdinal("ProfilePhoto")),
                                ParentCommentId = reader.GetInt32(reader.GetOrdinal("ParentCommentId"))
                            };

                            replies.Add(reply);
                        }

                        return Ok(replies);
                    }
                }
            }
        }


        [HttpDelete]
        [Route("DeleteComments/{commentId}")]
        public IHttpActionResult DeleteComments(int commentId)
        {
            try
            {
                var comment = db.PostComments.FirstOrDefault(c => c.CommentId == commentId);
                if (comment == null)
                {
                    return NotFound();
                }
        
                var relatedComments = db.PostComments.Where(c => c.CommentId == commentId || c.ParentCommentId == commentId && c.IsDeleted != 1).ToList();
                var totalCommentCount = relatedComments.Count;
        
                var post = db.UserPosts.FirstOrDefault(p => p.PostId == comment.PostId);
                if (post != null)
                {
                    post.CommentCount -= totalCommentCount;
                }
        
                var relatedCommentIds = relatedComments.Select(c => c.CommentId).ToList();
        
                var relatedCommentLikes = db.CommentLikes.Where(cl => relatedCommentIds.Contains((int)cl.CommentId)).ToList();
                db.CommentLikes.RemoveRange(relatedCommentLikes);
        
                foreach (var relatedComment in relatedComments)
                {
                    relatedComment.IsDeleted = 1;
                }
        
                db.SaveChanges();
                return Ok();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine(ex.ToString());
                return Conflict();
            }
            catch (Exception ex)
            {                
                Console.WriteLine(ex.ToString());
                return InternalServerError(ex);
            }
        }


        [HttpPost] //sp
        [Route("LikeComment")]
        public IHttpActionResult LikeComment([FromBody] CommentLike likeRequest)
        {
            if (likeRequest == null || likeRequest.UserId <= 0 || likeRequest.CommentId <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (var command = new SqlCommand("LikeComment", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@UserId", likeRequest.UserId));
                    command.Parameters.Add(new SqlParameter("@CommentId", likeRequest.CommentId));

                    command.ExecuteNonQuery();
                }
            }

            return Ok();
        }

        [HttpDelete] //sp
        [Route("UnlikeComment")]
        public IHttpActionResult UnlikeComment([FromBody] CommentLike unlikeRequest)
        {
            if (unlikeRequest == null || unlikeRequest.UserId <= 0 || unlikeRequest.CommentId <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (var command = new SqlCommand("UnlikeComment", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@UserId", unlikeRequest.UserId));
                    command.Parameters.Add(new SqlParameter("@CommentId", unlikeRequest.CommentId));

                    command.ExecuteNonQuery();
                }
            }

            return Ok();
        }


        [HttpGet] //sp
        [Route("GetLastPost")]
        public IHttpActionResult GetLastPost()
        {
            var data = db.GetLastPost(); 
            return Ok(data);
        }
        
        [HttpGet] //sp
        [Route("GetLastComment")]
        public IHttpActionResult GetLastComment()
        {
            var data = db.GetLastComment();
            return Ok(data);
        }


        [HttpGet]
        [Route("GetAllUser/{currentUserId}")]
        public IHttpActionResult GetAllUser(int currentUserId)
        {
            var usersNotFriends = db.UserDatas
                .Where(u => u.UserId != currentUserId)
                .Select(user => new
                {
                    UserId = user.UserId,
                    LastName = user.LastName,
                    FirstName = user.FirstName,
                    ProfilePhoto = user.ProfilePhoto,
                    IsFriend = db.UserFriends.Any(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                                       (f.UserId == user.UserId && f.FollowerId == currentUserId)),
                    RequestStatus = db.UserFriends.Where(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                                               (f.UserId == user.UserId && f.FollowerId == currentUserId))
                                  .Select(f => f.RequestStatus).FirstOrDefault(),
                    FollowerId = db.UserFriends.Where(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                                 (f.UserId == user.UserId && f.FollowerId == currentUserId))
                    .Select(f => f.FollowerId)
                    .FirstOrDefault()
                }).ToList();
           
            return Ok(usersNotFriends);
        }


        [HttpPost]
        [Route("AddFriend")]
        public IHttpActionResult AddFriend(UserFriend request)
        {
            int currentUserId = (int)request.FollowerId;

            if (request.UserId == currentUserId)
                return BadRequest("You cannot add yourself as a friend.");

            bool isFriendshipExisting = db.UserFriends
                .Any(f => (f.UserId == currentUserId && f.FollowerId == request.UserId) ||
                          (f.UserId == request.UserId && f.FollowerId == currentUserId));

            if (isFriendshipExisting) 
                return BadRequest("Friendship already exists.");

            UserFriend newFriendship = new UserFriend
            {
                UserId = currentUserId,
                FollowerId = request.UserId,
                IsFriend = 1,
                RequestStatus = "pending"
            };
            db.UserFriends.Add(newFriendship);
            db.SaveChanges();
            return Ok();
        }


        [HttpPost]
        [Route("RemoveFriend")]
        public IHttpActionResult RemoveFriend(UserFriend request)
        {
            int currentUserId = (int)request.UserId;
            int friendId = (int)request.FollowerId;

            var existingFriendship = db.UserFriends
                .FirstOrDefault(f => (f.UserId == currentUserId && f.FollowerId == friendId) ||
                                      (f.UserId == friendId && f.FollowerId == currentUserId));

            if (existingFriendship == null)
                return BadRequest("Friendship does not exist.");

            db.UserFriends.Remove(existingFriendship);
            db.SaveChanges();
            return Ok();
        }


        [HttpPost]
        [Route("ConfirmFriendRequest")]
        public IHttpActionResult ConfirmFriendRequest(UserFriend request)
        {
            int currentUserId = (int)request.UserId;
            int friendId = (int)request.FollowerId;

            var friendRequest = db.UserFriends.FirstOrDefault(f => (f.UserId == currentUserId && f.FollowerId == friendId) ||
                                                                   (f.UserId == friendId && f.FollowerId == currentUserId));
            if (friendRequest != null)
            {
                friendRequest.RequestStatus = "accepted";
                friendRequest.IsFriend = 2;
                db.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest("Friend request not found.");
            }
        }

        [HttpGet] //sp
        [Route("notifications")]
        public IHttpActionResult GetNotifications()
        {      
            var data = db.GetAllNotifications();            
            return Ok(data);
        }

        [HttpPost] 
        [Route("forgotpassword")]
        public IHttpActionResult forgotpassword(string email)
        {
            var user = db.UserDatas.SingleOrDefault(u => u.Email == email);
            if (user == null)
            {
                return BadRequest();
            }
            string token = Membership.GeneratePassword(20, 5);

            //string token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            var resetToken = new PasswordResetToken
            {
                Email = email,
                Token = token,
                CreatedAt = DateTime.UtcNow
            };

            db.PasswordResetTokens.Add(resetToken);
            db.SaveChanges();

            SendEmail(email, token);
            return Ok();
        }      
         
        private void SendEmail(string usermail, string token)
        {
            try
            {
                string encodedToken = System.Web.HttpUtility.UrlEncode(token);
              
                string resetLink = $"https://localhost:44321/SMF/resetpassword?token={encodedToken}";

                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress("demo94551@gmail.com");
                    mail.To.Add(usermail);
                    mail.Subject = "Forgot Password";
                    mail.Body = $"Click this link to reset your password: {resetLink}";

                    using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential("demo94551@gmail.com", "apmh lrvo fmrb knji");
                        smtp.EnableSsl = true;
                        smtp.Send(mail);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Failed to send mail: {e.Message}");
            }
        }

        [HttpGet]
        [Route("resetpassword")]
        public IHttpActionResult ResetPassword(string token, string password)
        {
            var resetToken = db.PasswordResetTokens.SingleOrDefault(t => t.Token == token);
            if (resetToken == null)
            {
                return BadRequest("Invalid token.");
            }

            if ((DateTime.UtcNow - resetToken.CreatedAt).TotalMinutes > 10)
            {
                return BadRequest("Token has expired.");
            }

            var user = db.UserDatas.SingleOrDefault(u => u.Email == resetToken.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            user.UserPassword = password;
            db.PasswordResetTokens.Remove(resetToken);
            db.SaveChanges();

            return Ok("Password has been reset successfully.");
        }

        [HttpGet]
        [Route("CheckToken")]
        public IHttpActionResult CheckToken(string token)
        {
            var resetToken = db.PasswordResetTokens.SingleOrDefault(t => t.Token == token);
            if (resetToken == null)
            {
                return BadRequest("Invalid token.");
            }

            if ((DateTime.UtcNow - resetToken.CreatedAt).TotalMinutes > 10)
            {
                return BadRequest("Token has expired.");
            }

            return Ok();
        }
    }
}


// [HttpGet]
// [Route("login")]
// public IHttpActionResult GetUser(string email, string password)
// {
//     using (var db = new SocialMediaAppEntities())
//     {
//         var user = db.UserDatas
//             .Where(u => u.Email == email && u.UserPassword == password)
//             .Select(u => new User
//             {
//                 UserId = u.UserId,
//                 FirstName = u.FirstName,
//                 LastName = u.LastName,
//                 Email = u.Email,
//                 City = u.City,
//                 UserPassword = u.UserPassword,
//                 Gender = u.Gender,
//                 ProfilePhoto = u.ProfilePhoto,
//                 Interests = u.Interests,
//                 PhoneNumber = u.PhoneNumber,
//                 Bio = u.Bio
//             })
//             .FirstOrDefault();
//         if (user != null)
//         {
//             return Ok(user);
//         }
//         return Unauthorized();
//     }
//}



//[HttpPost]
//[Route("Register")]
//public IHttpActionResult AddUser(UserData user)
//{
//    if (user.Email != null && user.UserPassword != null)
//    {
//        user.ProfilePhoto = "/postupload/imange.jpg";
//        var existingUser = db.UserDatas.FirstOrDefault(u => u.Email == user.Email);
//        if (existingUser != null)
//        {
//            return Conflict();
//        }
//        db.UserDatas.Add(user);
//        db.SaveChanges();
//        Sendotp(user.Email);
//        return Ok();
//    }
//    return Unauthorized();
//}


//[HttpGet]
//[Route("{id}")]
//public IHttpActionResult GetUserById(int id)
//{
//    UserData user = db.UserDatas.FirstOrDefault(x => x.UserId == id);
//    if (user != null)
//    {
//        var userInfo = new User
//        {
//            UserId = user.UserId,
//            LastName = user.LastName,
//            FirstName = user.FirstName,
//            City = user.City,
//            Email = user.Email,
//            UserPassword = user.UserPassword,
//            Gender = user.Gender,
//            ProfilePhoto = user.ProfilePhoto,
//            Interests = user.Interests,
//            PhoneNumber = user.PhoneNumber,
//            Bio = user.Bio,
//            BirthDate = user.BirthDate,
//            Posts = user.UserPosts.Select(post => new Post
//            {
//                PostId = post.PostId,
//                PostContent = post.PostContent,
//                PostPhoto = post.PostPhoto,
//                PostDate = post.PostDate,
//                LikeCount = post.LikeCount,
//                CommentCount = post.CommentCount,
//                ShareCount = post.ShareCount
//            }).ToList()
//        };
//        return Ok(userInfo);
//    }
//    return Unauthorized();
//}


//[HttpPut]
//[Route("{id}")]
//public IHttpActionResult UpdateUserInfo([FromBody] UserData user, int id)
//{
//    var userToUpdate = db.UserDatas.FirstOrDefault(x => x.UserId == id);
//    if (userToUpdate != null)
//    {
//        var existingEmailUser = db.UserDatas.FirstOrDefault(x => x.Email == user.Email && x.UserId != id);
//        var existingPhoneUser = db.UserDatas.FirstOrDefault(x => x.PhoneNumber == user.PhoneNumber && x.UserId != id);
//        if (existingEmailUser != null || existingPhoneUser != null)
//        {
//            return BadRequest("The provided email address or phone number is already in use.");
//        }
//        userToUpdate.FirstName = user.FirstName;
//        userToUpdate.LastName = user.LastName;
//        userToUpdate.City = user.City;
//        userToUpdate.UserPassword = user.UserPassword;
//        userToUpdate.Email = user.Email;
//        userToUpdate.Gender = user.Gender;
//        userToUpdate.Interests = user.Interests;
//        userToUpdate.PhoneNumber = user.PhoneNumber;
//        userToUpdate.Bio = user.Bio;
//        userToUpdate.BirthDate = user.BirthDate;
//        db.SaveChanges();
//        return Ok();
//    }
//    else
//    {
//        return NotFound();
//    }
//}


//[HttpPost]
//[Route("UpdateStoryView")]
//public IHttpActionResult UpdateStoryView(int storyId, int userid)
//{
//    try
//    {
//        using (var context = new SocialMediaAppEntities())
//        {
//            var storyView = new StoryView
//            {
//                UserId = userid,
//                StoryId = storyId
//            };
//            context.StoryViews.Add(storyView);
//            context.SaveChanges();

//            return Ok("StoryVideo updated successfully for the provided story ID");
//        }
//    }
//    catch (Exception ex)
//    {
//        return BadRequest(ex.Message);
//    }
//}


//[HttpGet]
//[Route("CheckIfViewed")]
//public IHttpActionResult CheckIfViewed(int storyId, int userId)
//{
//    try
//    {
//        using (var context = new SocialMediaAppEntities())
//        {
//            var viewed = context.StoryViews.Any(sv => sv.UserId == userId && sv.StoryId == storyId);
//            return Ok(viewed);
//        }
//    }
//    catch (Exception ex)
//    {
//        return InternalServerError(ex);
//    }
//}


//[HttpPut]
//[Route("Deletepost/{id}")]
//public IHttpActionResult Deletepost(int id)
//{
//    var post = db.UserPosts.Find(id);
//    if (post != null)
//    {
//        post.Status = 2;
//        db.SaveChanges();
//        return Ok();
//    }
//    return BadRequest("Post Not Deleted");
//} 

//[HttpPut]
//[Route("addarchievepost/{id}")]
//public IHttpActionResult addarchievepost(int id)
//{
//    var post = db.UserPosts.Find(id);
//    if (post != null)
//    {
//        post.Status = 1;
//        db.SaveChanges();
//        return Ok();
//    }
//    return BadRequest("Post Not Deleted");
//}

//[HttpPut]
//[Route("removearchievepost/{id}")]
//public IHttpActionResult removearchievepost(int id)
//{
//    var post = db.UserPosts.Find(id);
//    if (post != null)
//    {
//        post.Status = 0;
//        db.SaveChanges();
//        return Ok();
//    }
//    return BadRequest("Post Not Deleted");
//}

//[HttpGet]
//[Route("GetCommentReplies/{parentCommentId}")]
//public IHttpActionResult GetCommentReplies(int parentCommentId)
//{
//    var replies = db.PostComments
//        .Where(c => c.ParentCommentId == parentCommentId)
//        .Select(c => new
//        {
//            c.CommentId,
//            c.CommentText,
//            c.CommentDate,
//            c.UserId,
//            UserName = c.UserData.FirstName + " " + c.UserData.LastName,
//            ProfilePhoto = c.UserData.ProfilePhoto,
//            ParentCommentId = c.ParentCommentId
//        })
//        .ToList();

//    return Ok(replies);
//}

//[HttpGet] 
//[Route("GetPostComments")]
//public IHttpActionResult GetPostComments(int postId, int userId)
//{
//    var comments = db.PostComments
//        .Where(c => c.PostId == postId && c.ParentCommentId == null)
//        .Select(c => new
//        {
//            c.CommentId,
//            c.CommentText,
//            c.CommentDate,
//            c.UserId,
//            UserName = c.UserData.FirstName + " " + c.UserData.LastName,
//            ProfilePhoto = c.UserData.ProfilePhoto,
//            ParentCommentId = c.ParentCommentId,
//            LikedByUser = c.CommentLikes.Any(cl => cl.UserId == userId),
//            LikeCount = c.LikeCount,
//            IsDelete = c.IsDeleted,
//            Replies = c.PostComments1
//                .Where(r => r.ParentCommentId == c.CommentId)
//                .Select(r => new
//                {
//                    r.CommentId,
//                    r.CommentText,
//                    r.CommentDate,
//                    r.UserId,
//                    UserName = r.UserData.FirstName + " " + r.UserData.LastName,
//                    ProfilePhoto = r.UserData.ProfilePhoto,
//                    ParentCommentId = r.ParentCommentId,
//                    LikedByUser = r.CommentLikes.Any(cl => cl.UserId == userId),
//                    LikeCount = r.LikeCount,
//                    IsDelete = r.IsDeleted
//                })
//                .ToList()
//        })
//        .AsEnumerable()
//        .Select(c => new
//        {
//            c.CommentId,
//            c.CommentText,
//            CommentDate = c.CommentDate,
//            c.UserId,
//            c.UserName,
//            c.ProfilePhoto,
//            c.ParentCommentId,
//            c.LikedByUser,
//            c.LikeCount,
//            c.IsDelete,
//            Replies = c.Replies
//                .Select(r => new
//                {
//                    r.CommentId,
//                    r.CommentText,
//                    CommentDate = r.CommentDate,
//                    r.UserId,
//                    r.UserName,
//                    r.ProfilePhoto,
//                    r.ParentCommentId,
//                    r.LikedByUser,
//                    r.LikeCount,
//                    r.IsDelete
//                })
//                .ToList()
//        })
//        .ToList();
//    return Ok(comments);
//}

//[HttpPost]
//[Route("LikePost")]
//public IHttpActionResult LikePost([FromBody] PostLike request)
//{
//    var post = db.UserPosts.Find(request.PostId);
//    if (post == null)
//    {
//        return NotFound();
//    }

//    var userLike = db.PostLikes.FirstOrDefault(l => l.PostId == request.PostId && l.UserId == request.UserId);
//    bool isLiked;

//    if (userLike == null)
//    {
//        var like = new PostLike
//        {
//            PostId = request.PostId,
//            UserId = request.UserId,
//            LikeDate = DateTime.Now
//        };
//        db.PostLikes.Add(like);
//        post.LikeCount++;
//        isLiked = true;
//    }
//    else
//    {
//        db.PostLikes.Remove(userLike);
//        post.LikeCount--;
//        isLiked = false;
//    }

//    db.SaveChanges();
//    return Ok(new { likeCount = post.LikeCount, isLiked });
//}


//[HttpPost]
//[Route("AddComment")]
//public IHttpActionResult AddComment(PostComment model)
//{
//    if (ModelState.IsValid)
//    {
//        var comment = new PostComment
//        {
//            PostId = model.PostId,
//            UserId = model.UserId,
//            CommentText = model.CommentText,
//            CommentDate = DateTime.Now,
//            ParentCommentId = model.ParentCommentId,
//            LikeCount = 0,
//            IsDeleted = 0
//        };

//        db.PostComments.Add(comment);
//        db.SaveChanges();

//        var post = db.UserPosts.Find(comment.PostId);
//        post.CommentCount++;
//        db.SaveChanges();

//        return Ok();
//    }
//    return BadRequest();
//}


//[HttpPost]
//[Route("LikeComment")]
//public IHttpActionResult LikeComment([FromBody] CommentLike likeRequest)
//{
//    if (likeRequest == null || likeRequest.UserId <= 0 || likeRequest.CommentId <= 0)
//    {
//        return BadRequest("Invalid request data.");
//    }

//    using (var context = new SocialMediaAppEntities())
//    {
//        var existingLike = context.CommentLikes
//            .FirstOrDefault(l => l.UserId == likeRequest.UserId && l.CommentId == likeRequest.CommentId);

//        if (existingLike == null)
//        {
//            var like = new CommentLike
//            {
//                UserId = likeRequest.UserId,
//                CommentId = likeRequest.CommentId,
//                LikeDate = DateTime.UtcNow
//            };

//            context.CommentLikes.Add(like);

//            var comment = context.PostComments.FirstOrDefault(c => c.CommentId == likeRequest.CommentId);
//            if (comment != null)
//            {
//                comment.LikeCount++;
//                context.SaveChanges(); 
//            }
//        }
//    }
//    return Ok();
//}

//[HttpDelete]
//[Route("UnlikeComment")]
//public IHttpActionResult UnlikeComment([FromBody] CommentLike unlikeRequest)
//{
//    if (unlikeRequest == null || unlikeRequest.UserId <= 0 || unlikeRequest.CommentId <= 0)
//    {
//        return BadRequest("Invalid request data.");
//    }
//    using (var context = new SocialMediaAppEntities())
//    {
//        var like = context.CommentLikes
//            .FirstOrDefault(l => l.UserId == unlikeRequest.UserId && l.CommentId == unlikeRequest.CommentId);

//        if (like != null)
//        {
//            context.CommentLikes.Remove(like);
//            context.SaveChanges();
//            var comment = context.PostComments.FirstOrDefault(c => c.CommentId == unlikeRequest.CommentId);
//            if (comment != null && comment.LikeCount > 0)
//            {
//                comment.LikeCount--;
//                context.SaveChanges(); 
//            }
//        }
//    }
//    return Ok();
//}


/// email otp
//[HttpPost]
//[Route("Sendotp")]
//public IHttpActionResult Sendotp(string email)
//{
//    string otp = GenerateOtp(6);

//    var resetToken = new PasswordResetToken
//    {
//        Email = email,
//        Token = otp,
//        CreatedAt = DateTime.UtcNow
//    };

//    db.PasswordResetTokens.Add(resetToken);
//    db.SaveChanges();

//    SendOtpEmail(email, otp);
//    return Ok();
//}

//private string GenerateOtp(int length)
//{
//    const string digits = "0123456789";
//    var random = new Random();
//    return new string(Enumerable.Repeat(digits, length)
//        .Select(s => s[random.Next(s.Length)]).ToArray());
//}

//private void SendOtpEmail(string usermail, string token)
//{
//    try
//    {
//        string resetLink = $"https://localhost:44321/SMF/Confirmotp?token={token}";

//        using (MailMessage mail = new MailMessage())
//        {
//            mail.From = new MailAddress("demo94551@gmail.com");
//            mail.To.Add(usermail);
//            mail.Subject = "Forgot Password";
//            mail.Body = $"Your OTP for resetting the password is: {token}";

//            using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
//            {
//                smtp.Credentials = new System.Net.NetworkCredential("demo94551@gmail.com", "apmh lrvo fmrb knji");
//                smtp.EnableSsl = true;
//                smtp.Send(mail);
//            }
//        }
//    }
//    catch (Exception e)
//    {
//        Console.WriteLine($"Failed to send mail: {e.Message}");
//    }
//}

