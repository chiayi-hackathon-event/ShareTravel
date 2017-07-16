using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShareTravel.Models
{
    public class PackageFormViewModel
    {
        public string PackageName { get; set; }
        public string PackageMemo { get; set; }
        //
        public string PlaceName { get; set; }
        public string Image { get; set; }
        public string Address { get; set; }
        public string Rating { get; set; }
        public string Place_Id { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
        public string PType { get; set; }
        public string URL_TAG { get; set; }
    }
}