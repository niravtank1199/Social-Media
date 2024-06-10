using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class PasswordChangeModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}