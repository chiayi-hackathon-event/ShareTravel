using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShareTravel.Models
{
    public class Place
    {
        public string Place_Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public double Distance { get; set; }
        public double Rating { get; set; }
        public string Address { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
        public string PType { get; set; }
    }
}