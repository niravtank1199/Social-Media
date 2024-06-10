using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class Story
    {
        public int StoryId { get; set; }
        public Nullable<int> UserId { get; set; }
        public string StoryImage { get; set; }
        public string StoryVideo { get; set; }
        public Nullable<System.DateTime> StoryDate { get; set; }

        public virtual User UserData { get; set; }
    }
}