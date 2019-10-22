function createMarkers(places) {
    console.log(places[0]);
    var bounds = new google.maps.LatLngBounds();
    let place;
    var infoWindowContent;

    for (var i = 0; i < 10; i++) {
      place = places[i]

      var request = {
        placeId: place.place_id,
        fields: ['website', 'formatted_phone_number', 'rating', 'name', 'url', 'photos', 'formatted_address', 'geometry']
      }

      service = new google.maps.places.PlacesService(map);
      service.getDetails(request, function (place, status){
        if (status == google.maps.places.PlacesServiceStatus.OK){
          console.log(curPos)
          console.log(place.geometry.location)
          var panel = document.getElementById('panel');

          var div = document.createElement('div');
          var iconsDiv = document.createElement('div');

          var imgDiv = document.createElement('div');
          var h2 = document.createElement('h2')
          var p = document.createElement('p');
          var websiteIcon = document.createElement('img');
          var aWebsite = document.createElement('a');
          var urlIcon = document.createElement('img');
          var aUrl = document.createElement('a');
          var photoImg = document.createElement('img');;
          var br = document.createElement('br');

          photoImg.className = "ice-cream-list-pic"
          photoImg.src = place.photos[2].getUrl();
          photoImg.width = "200";
          photoImg.height = "200";
          imgDiv.append(photoImg);

          urlIcon.className = "list-icon"
          urlIcon.src = "https://icon-library.net/images/google-maps-directions-icon/google-maps-directions-icon-8.jpg";

          aUrl.href = place.url;
          aUrl.target = "_blank";
          aUrl.appendChild(urlIcon);
          iconsDiv.append(aUrl);

          iconsDiv.className = "icon-div"

          websiteIcon.className = "list-icon";
          websiteIcon.src = "https://www.freeiconspng.com/uploads/website-icon-18.png";

          if (place.website !== undefined){
            aWebsite.href = place.website;
          }
          else{
            aWebsite.href = ".";
          }
          aWebsite.target = "_blank"
          aWebsite.appendChild(websiteIcon);
          iconsDiv.append(aWebsite);

          div.className = "ice-cream-list";
          p.textContent = place.formatted_address
          h2.textContent = `${place.name}`;
          div.append(h2, imgDiv, iconsDiv, p);
          panel.appendChild(div);
        }
        else{
          console.log(status);
        }
      })

      var image = {
        url: "https://www.cfacdn.com/img/order/COM/Menu_Refresh/Drinks/Drinks%20PDP/_0000s_0027_%5BFeed%5D_0006s_0013_Drinks_Ice-Dream.png",
        size: new google.maps.Size(100, 100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
      };

      infoWindowContent = '<div class="info_content">' +
      `<h3>${place.name}</h3>` + 
      `<p>${place.formatted_address}</p>` + 
      '</div>';

      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
        label: {
          text: `${i + 1}`,
          color: 'white'
        },
        clickable: true
      });
      
      marker.info = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      
      console.log(marker)
      
      google.maps.event.addListener(marker, 'click', function() {
        console.log(marker);
        var thisMap = this.getMap()
        this.info.open(this.getMap(), this);
      });

      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  }

  function callback(results, status) {
    var myLatLng = {};
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMarkers(results);
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }