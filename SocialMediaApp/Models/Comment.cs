using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class Comment
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
}