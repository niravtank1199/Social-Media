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
    
    public partial class StoryView
    {
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> StoryId { get; set; }
    
        public virtual UserStory UserStory { get; set; }
        public virtual UserData UserData { get; set; }
    }
}