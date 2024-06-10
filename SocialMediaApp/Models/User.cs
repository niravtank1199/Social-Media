using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string City { get; set; }
        public string Email { get; set; }
        public string UserPassword { get; set; }
        public string Gender { get; set; }
        public string ProfilePhoto { get; set; }
        public string Interests { get; set; }
        public string PhoneNumber { get; set; }
        public string Bio { get; set; }
        public DateTime? BirthDate { get; set; }

        public ICollection<Post> Posts { get; set; }
        public virtual ICollection<Like> PostLikes { get; set; }
        public virtual ICollection<Comment> PostComments { get; set; }
        public virtual ICollection<Message> UserMessages { get; set; }
        public virtual ICollection<Message> UserMessages1 { get; set; }
        public virtual ICollection<Friend> UserFriends { get; set; }
        public virtual ICollection<Friend> UserFriends1 { get; set; }
    }
}