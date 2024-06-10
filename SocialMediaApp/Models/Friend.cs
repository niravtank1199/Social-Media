using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class Friend
    {
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> FollowerId { get; set; }
        public Nullable<bool> IsFriend { get; set; }
        public Nullable<bool> RequestStatus { get; set; }
        public virtual User UserData { get; set; }
        public virtual User UserData1 { get; set; }
    }
}