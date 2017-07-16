using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShareTravel.Models;

namespace ShareTravel.Controllers
{
    public class TravelController : Controller
    {
        public ActionResult ListPlace(string lat, string lng)
        {
            ViewBag.Lat = lat;
            ViewBag.Lng = lng;
            return View();
        }

        public ActionResult Pano(string lat, string lng, string place_id, string name, string address, string image, string distance, string rating, string ptype)
        {
            //25.037953, 121.517455
            if (lat == null || lng == null)
            {
                lat = "25.037953";
                lng = "121.517455";
            }

            ViewBag.Lat = Convert.ToDouble(lat);
            ViewBag.Lng = Convert.ToDouble(lng);
            ViewBag.Place_Id = place_id;
            ViewBag.Name = name;
            ViewBag.Address = address;
            ViewBag.Image = image;
            ViewBag.Distance = distance;
            ViewBag.Rating = rating;
            ViewBag.PType = ptype;
            return View();
        }

        public ActionResult Add(string place_id, string image, string name, string address, string rating, string distance, string lat, string lng, string ptype)
        {
            Place place = new Place
            {
                Place_Id = place_id,
                Image = image,
                Name = name,
                Rating = Convert.ToDouble(rating),
                Distance = Convert.ToDouble(distance),
                Address = address,
                Lat = lat,
                Lng = lng,
                PType = ptype
            };

            if (Session["cart"] == null)
            {
                List<Place> placeList = new List<Place>();

                placeList.Add(place);
                Session["cart"] = placeList;
                

            }
            else
            {
                List<Place> placeList = (List<Place>)Session["cart"];
                placeList.Add(place);
            }

            return RedirectToAction("ListPlace", "Travel", new { lat = lat, lng = lng });
        }

        public ActionResult Cart(string command)
        {
            if (command == "clear") {
                List<Place> placeList = new List<Place>();

                Session["cart"] = placeList;
            }

            return View((List<Place>)Session["cart"]);
        }

        

        openTCLEntities db = new openTCLEntities();
        public ActionResult CreatePackage(PackageFormViewModel[] packageForm)
        {
            var stPIdList = db.ShareTravelPlace.Select(p => p.Place_Id).ToList();
            string placesField = "", packageName = "", memo = "",url_tag ="";

            List<ShareTravelPlace> stPlaceList = new List<ShareTravelPlace>();

            //List<PackageFormViewModel> pfList = new List<PackageFormViewModel>();
            for (int i = 0; i < packageForm.Length; i++)
            {
                //分為 package , place 存放
                //package:
                if (i == packageForm.Length - 1)
                {
                    placesField += packageForm[i].Place_Id;
                    packageName = packageForm[i].PackageName;
                    memo = packageForm[i].PackageMemo;
                    if (packageForm[i].URL_TAG != null) {
                        url_tag = packageForm[i].URL_TAG;
                    }
                }
                else
                    placesField += packageForm[i].Place_Id + ";";

                // DB 還沒有資料 才存
                //place:
                if (!stPIdList.Contains(packageForm[i].Place_Id))
                {
                    stPlaceList.Add(new ShareTravelPlace
                    {
                        Place_Id = packageForm[i].Place_Id,
                        PlaceName = packageForm[i].PlaceName,
                        Address = packageForm[i].Address,
                        Image = packageForm[i].Image,
                        Rating = Convert.ToDouble(packageForm[i].Rating),
                        Lat = Convert.ToDouble(packageForm[i].Lat),
                        Lng = Convert.ToDouble(packageForm[i].Lng),
                        PType = packageForm[i].PType
                        
                       
                    });
                }

            }

            foreach (var item in stPlaceList)
            {
                db.ShareTravelPlace.Add(item);
            }

            var stpgArr = db.ShareTravelPackage.ToArray();

            var pgResult = from p in stpgArr
                           where p.PackageName == packageName
                           select p.STP_Id;

            foreach (var item in pgResult) {
                ShareTravelPackage stpg = db.ShareTravelPackage.Find(item);
                db.ShareTravelPackage.Remove(stpg);
            }

            db.ShareTravelPackage.Add(new ShareTravelPackage
            {
                PackageName = packageName,
                Memo = memo,
                TravelDateTime = DateTime.Now,
                Places = placesField
            });


            db.SaveChanges();

            if (url_tag == "BP") {
                return RedirectToAction("ListBackupPackage", "Travel"); 
            }

            //TempData["PFList"] = pfList;

            return RedirectToAction("ListPackage", "Travel"); // 先將packageForm 丟到 ViewBag.package 然後 redirect 到 Package(); 未來是要 redirect 到 ListPackage();
        }



        public ActionResult ListComparePackage()
        {
            return View(db.ShareTravelPackage.ToArray());
        }

        public ActionResult ListPackage()
        {

            ViewBag.STPlaces = db.ShareTravelPlace.ToArray();
            return View(db.ShareTravelPackage.ToArray());
        }


        public ActionResult ListBackupPackage()
        {

            List<ShareTravelPackage> stpList = new List<ShareTravelPackage>();
            ViewBag.STPlaces = db.ShareTravelPlace.ToArray();

            var stpArr = db.ShareTravelPackage.ToArray();

            var backupResult = from p in stpArr
                               where p.PackageName.IndexOf("備案") > -1
                               select p;
            foreach (var item in backupResult) {
                string packageName = item.PackageName.Substring(0, item.PackageName.IndexOf("備案"));
                var packageResult = from p in stpArr
                                    where p.PackageName == packageName
                                    select p;
                stpList.Add(packageResult.First());
                stpList.Add(item);
            }

            return View(stpList.ToArray());
        }


        public ActionResult Package(string packageName) // 用 packageName 當 key
        {

            if (packageName != null)
            {
                var result = from p in db.ShareTravelPackage.ToArray()
                             where p.PackageName == packageName
                             select p;

                List<PackageFormViewModel> pfList = new List<PackageFormViewModel>();

                //todo 帶出 place string 並 split , 把每一個 place 轉成 packageFormViewModel
                string pName = "", pMemo = "";
                foreach (var item in result)
                {
                    string[] places = item.Places.Split(';');
                    pName = item.PackageName;
                    pMemo = item.Memo;
                    foreach (var pItem in places)
                    {
                        var pInfo = from s in db.ShareTravelPlace
                                    where s.Place_Id == pItem
                                    select s;
                        foreach (var stPlace in pInfo)
                        {
                            pfList.Add(new PackageFormViewModel
                            {
                                PlaceName = stPlace.PlaceName,
                                Address = stPlace.Address,
                                Image = stPlace.Image,
                                Rating = Convert.ToString(stPlace.Rating),
                                Place_Id = stPlace.Place_Id,
                                Lat = Convert.ToString(stPlace.Lat),
                                Lng = Convert.ToString(stPlace.Lng),
                                PackageName = pName,
                                PackageMemo = pMemo
                            });
                        }
                    }
                }

                ViewBag.PFList = pfList;

            }
            //ViewBag.PFList = TempData["PFList"];
            return View();
        }

        public ActionResult PackageSlide(string packageName, string slideTheme)
        {

            ViewBag.Theme = slideTheme;
            List<Map> mapList = new List<Map>();
            List<Place> places = new List<Place>();
            string pName = "", pMemo = "";
            if (packageName != null)
            {
                var result = from p in db.ShareTravelPackage.ToArray()
                             where p.PackageName == packageName
                             select p;


                //todo 帶出 place string 並 split , 把每一個 place 轉成 packageFormViewModel

                foreach (var item in result)
                {
                    string[] placeStrs = item.Places.Split(';');
                    pName = item.PackageName;
                    pMemo = item.Memo;
                    foreach (var pItem in placeStrs)
                    {
                        var pInfo = from s in db.ShareTravelPlace
                                    where s.Place_Id == pItem
                                    select s;
                        foreach (var stPlace in pInfo)
                        {
                            places.Add(new Place
                            {
                                Name = stPlace.PlaceName,
                                Address = stPlace.Address,
                                Image = stPlace.Image,
                                Rating = stPlace.Rating,
                                Place_Id = stPlace.Place_Id,
                                Lat = Convert.ToString(stPlace.Lat),
                                Lng = Convert.ToString(stPlace.Lng)
                            });
                        }
                    }
                }

            }


            string pathString = "", title = "";
            Place[] pArray = places.ToArray();
            for (int i = 0; i < pArray.Length; i++)
            {

                if (i == pArray.Length - 1)
                {
                    break;
                }
                title = pArray[i].Name + " to " + pArray[i + 1].Name;
                pathString = pArray[i].Lat + "," + pArray[i].Lng + "|" + pArray[i + 1].Lat + "," + pArray[i + 1].Lng;
                mapList.Add(new Map { Title = title, Path = pathString });

            }

            ViewBag.Places = places;
            ViewBag.Maps = mapList.ToArray();
            ViewBag.PName = pName;
            ViewBag.PMemo = pMemo;

            return View();
        }


        public ActionResult ComparePackage(SelectedPackage[] sp)
        {
            if (sp != null) {
                var pNames = sp.Where(c => c.Selected).Select(s => s.PackageName);


                var result = from p in db.ShareTravelPackage.ToArray()
                             where pNames.ToArray().Contains(p.PackageName)
                             select p;

                //string jstr = "  { \"name\": \"abc\", \"age\": 50 },{ \"age\": \"25\", \"hobby\": \"swimming\" },{ \"name\": \"xyz\", \"hobby\": \"programming\" }";
                string jstr2 = "";

                var stPlaceArr = db.ShareTravelPlace.ToArray();

                int j = 0;
                foreach (var item in result)
                {

                    string[] placeIdArr = item.Places.Split(';');
                    /*
                    var places = from p in db.ShareTravelPlace.ToArray()
                                 where placeIdArr.Contains(p.Place_Id)
                                 select p;
                                 */
                    int i = 0, len = 0;
                    string jsStr = "", record = "";
                    jsStr = "\"行程名稱\":" + "\"" + item.PackageName + "\",";
                    for (i = 0, len = placeIdArr.Length; i < len; i++)
                    {

                        int tempNo = 0;
                        if (i == len - 1)
                        {
                            var places = from p in stPlaceArr
                                         where p.Place_Id == placeIdArr[i]
                                         select p;

                            var pItem = places.First();
                            tempNo = i + 1;
                            jsStr += "\"景點" + tempNo + "\":" + "\"<button  class='btn btn-info' data-toggle='modal' data-target='#myModal' onclick='' image='" + pItem.Image + "' address='" + pItem.Address + "'  rating='" + pItem.Rating + "' placeName='" + pItem.PlaceName + "'>" + pItem.PlaceName + "</button>\"";

                        }
                        else
                        {

                            var places = from p in stPlaceArr
                                         where p.Place_Id == placeIdArr[i]
                                         select p;

                            var pItem = places.First();

                            var places2 = from p in stPlaceArr
                                          where p.Place_Id == placeIdArr[i + 1]
                                          select p;

                            var nextPItem = places2.First();

                            /*
                            var distance = GetDistance(
                                            Convert.ToDouble(pItem.Lat),
                                            Convert.ToDouble(pItem.Lng),
                                            Convert.ToDouble(nextPItem.Lat),
                                            Convert.ToDouble(nextPItem.Lng),
                                            GeolocationUtils.DistanceUnit.Kilometers).ToString("###.#", CultureInfo.CurrentUICulture);

                             */
                            tempNo = i + 1;

                            jsStr += "\"景點" + tempNo + "\":" + "\"<button class='btn btn-info' data-toggle='modal' data-target='#myModal' onclick='' image='" + pItem.Image + "' address='" + pItem.Address + "'  rating='" + pItem.Rating + "' placeName='" + pItem.PlaceName + "'>" + pItem.PlaceName + "</button>\",\"距離" + tempNo + "\":\"<span id='spanDriving" + j + i + "' class='driving' onclick='' lat1='" + pItem.Lat + "' lng1='" + pItem.Lng + "' lat2='" + nextPItem.Lat + "' lng2='" + nextPItem.Lng + "'  currentPName='" + pItem.PlaceName + "' nextPName='" + nextPItem.PlaceName + "' ></span><span id='spanTransit" + j + i + "' class='transit' onclick='' lat1='" + pItem.Lat + "' lng1='" + pItem.Lng + "' lat2='" + nextPItem.Lat + "' lng2='" + nextPItem.Lng + "'  currentPName='" + pItem.PlaceName + "' nextPName='" + nextPItem.PlaceName + "' fare='' ></span>\",";
                        }



                    }

                    record = "{" + jsStr + "},";
                    jstr2 += record;
                    j++;
                }


                ViewBag.JSON = jstr2;

            }


            return View();
        }

        public ActionResult BackupPackage(string packageName)
        {
            if (packageName != null)
            {
                var result = from p in db.ShareTravelPackage.ToArray()
                             where p.PackageName == packageName
                             select p;

                List<PackageFormViewModel> pfList = new List<PackageFormViewModel>();

                //todo 帶出 place string 並 split , 把每一個 place 轉成 packageFormViewModel
                string pName = "", pMemo = "";
                foreach (var item in result)
                {
                    string[] places = item.Places.Split(';');
                    pName = item.PackageName;
                    pMemo = item.Memo;
                    foreach (var pItem in places)
                    {
                        var pInfo = from s in db.ShareTravelPlace
                                    where s.Place_Id == pItem
                                    select s;
                        foreach (var stPlace in pInfo)
                        {
                            pfList.Add(new PackageFormViewModel
                            {
                                PlaceName = stPlace.PlaceName,
                                Address = stPlace.Address,
                                Image = stPlace.Image,
                                Rating = Convert.ToString(stPlace.Rating),
                                Place_Id = stPlace.Place_Id,
                                Lat = Convert.ToString(stPlace.Lat),
                                Lng = Convert.ToString(stPlace.Lng),
                                PackageName = pName,
                                PackageMemo = pMemo,
                                PType = stPlace.PType
                            });
                        }
                    }
                }

                ViewBag.PFList = pfList;

            }
            return View();
        }

        public ActionResult DeletePackage(int stp_Id) {
            ShareTravelPackage stp = db.ShareTravelPackage.Find(stp_Id);

            if (stp != null) {

                var backupResult = from p in db.ShareTravelPackage.ToArray()
                                   where p.PackageName == stp.PackageName + "備案"
                                   select p;

                foreach (var item in backupResult)
                {
                    db.ShareTravelPackage.Remove(item);
                }


                db.ShareTravelPackage.Remove(stp);
                db.SaveChanges();
            }

            return RedirectToAction("ListPackage","Travel");
        }


    }
}