//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SocialMediaApp.Context
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserStoryLike
    {
        public int LikeId { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> StoryId { get; set; }
        public Nullable<System.DateTime> LikeDate { get; set; }
    
        public virtual UserData UserData { get; set; }
        public virtual UserStory UserStory { get; set; }
    }
}
