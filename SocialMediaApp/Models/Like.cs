using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
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
}