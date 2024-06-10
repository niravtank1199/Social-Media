using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class Message
    {
        public int MessageId { get; set; }
        public Nullable<int> SenderId { get; set; }
        public Nullable<int> ReceiverId { get; set; }
        public string MessageText { get; set; }
        public Nullable<System.DateTime> MessageTime { get; set; }

        public virtual User UserData { get; set; }
        public virtual User UserData1 { get; set; }
    }
}