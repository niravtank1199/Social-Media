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
    
    public partial class GetUserNotifications_Result
    {
        public string ProfilePhoto { get; set; }
        public int UserId { get; set; }
        public int NotificationID { get; set; }
        public string NotificationType { get; set; }
        public Nullable<int> NotificationSenderUserId { get; set; }
        public Nullable<int> NotificationPostId { get; set; }
        public string NotificationText { get; set; }
        public Nullable<System.DateTime> NotificationTimestamp { get; set; }
        public string NotificationStatus { get; set; }
    }
}
