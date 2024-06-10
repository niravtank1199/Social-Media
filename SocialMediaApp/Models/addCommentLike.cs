using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class addCommentLike
    {
        public int LikeId { get; set; }
        public Nullable<int> CommentId { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<System.DateTime> LikeDate { get; set; }

        public virtual Comment PostComment { get; set; }
        public virtual User UserData { get; set; }
    }
}