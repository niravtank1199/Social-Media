using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SocialMediaApp.Context;

namespace SocialMediaApp.Models
{
    public class UserInfo
    {
        
    }
    public class User
    {
        public int UserId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string City { get; set; }
        public string Email { get; set; }
        public string UserPassword { get; set; }
        public string Gender { get; set; }
        public string ProfilePhoto { get; set; }
        public string Interests { get; set; }
        public string PhoneNumber { get; set; }
        public string Bio { get; set; }
        public DateTime? BirthDate { get; set; }

        public ICollection<Post> Posts { get; set; }
        public virtual ICollection<Like> PostLikes { get; set; }
        public virtual ICollection<Comment> PostComments { get; set; }
        public virtual ICollection<Message> UserMessages { get; set; }
        public virtual ICollection<Message> UserMessages1 { get; set; }
        public virtual ICollection<Friend> UserFriends { get; set; }
        public virtual ICollection<Friend> UserFriends1 { get; set; }
    }

    public class Post
    {
        public int PostId { get; set; }
        public Nullable<int> UserId { get; set; }
        public string PostContent { get; set; }
        public string PostPhoto { get; set; }        
        public Nullable<System.DateTime> PostDate { get; set; }
        public Nullable<int> LikeCount { get; set; }
        public Nullable<int> CommentCount { get; set; }
        public Nullable<int> ShareCount { get; set; }     
        public virtual User UserData { get; set; }
        public virtual ICollection<Like> PostLikes { get; set; }
        public virtual ICollection<Comment> PostComments { get; set; }
        public Nullable<int> Status { get; set; }
    }

    public class Like
    {
        public int LikeId { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> PostId { get; set; }
        public Nullable<System.DateTime> LikeDate { get; set; }
        public Nullable<int> LikeType { get; set; }
        public virtual Post UserPost { get; set; }
        public virtual User UserData { get; set; }
    }


    

    public partial class Comment
    {
        public int CommentId { get; set; }
        public Nullable<int> PostId { get; set; }
        public Nullable<int> UserId { get; set; }
        public string CommentText { get; set; }
        public Nullable<System.DateTime> CommentDate { get; set; }
        public Nullable<int> ParentCommentId { get; set; }
        public virtual Post UserPost { get; set; }
        public virtual User UserData { get; set; }
        public Nullable<int> LikeCount { get; set; }
        public Nullable<int> IsDeleted { get; set; }
        public virtual ICollection<Comment> PostComments1 { get; set; }
        public virtual Comment PostComment1 { get; set; }
    }

    public partial class Message
    {
        public int MessageId { get; set; }
        public Nullable<int> SenderId { get; set; }
        public Nullable<int> ReceiverId { get; set; }
        public string MessageText { get; set; }
        public Nullable<System.DateTime> MessageTime { get; set; }

        public virtual User UserData { get; set; }
        public virtual User UserData1 { get; set; }
    }
    public partial class Friend
    {
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> FollowerId { get; set; }
        public Nullable<bool> IsFriend { get; set; }
        public Nullable<bool> RequestStatus { get; set; }
        public virtual User UserData { get; set; }
        public virtual User UserData1 { get; set; }
    }

    public class PasswordChangeModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public partial class userNotification
    {
        public int NotificationID { get; set; }
        public Nullable<int> UserID { get; set; }
        public string NotificationType { get; set; }
        public Nullable<int> NotificationSenderUserID { get; set; }
        public Nullable<int> NotificationPostID { get; set; }
        public string NotificationText { get; set; }
        public Nullable<System.DateTime> NotificationTimestamp { get; set; }
        public string NotificationStatus { get; set; }

        public virtual User UserData { get; set; }
    }
    public partial class Story
    {
        public int StoryId { get; set; }
        public Nullable<int> UserId { get; set; }
        public string StoryImage { get; set; }
        public string StoryVideo { get; set; }
        public Nullable<System.DateTime> StoryDate { get; set; }

        public virtual User UserData { get; set; }
    }

     partial class addCommentLike
    {
        public int LikeId { get; set; }
        public Nullable<int> CommentId { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<System.DateTime> LikeDate { get; set; }

        public virtual Comment PostComment { get; set; }
        public virtual User UserData { get; set; }
    }

    public partial class StoryLike
    {
        public int LikeId { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> StoryId { get; set; }
        public Nullable<System.DateTime> LikeDate { get; set; }

        public virtual User UserData { get; set; }
        public virtual Story UserStory { get; set; }
    }


    //public partial class StoryView
    //{
    //    public int Id { get; set; }
    //    public Nullable<int> UserId { get; set; }
    //    public Nullable<int> StoryId { get; set; }

    //    public virtual Story UserStory { get; set; }
    //    public virtual User UserData { get; set; }
    //}


}
