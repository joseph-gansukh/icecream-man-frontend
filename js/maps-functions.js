let glyphStates = {
  "♡": "♥",
  "♥": "♡"
};

glyphState = {
  'none' : '',
  '' : 'none'
}
let restObj = {};

let divCount = 0;

function createMarkers(places) {
  console.log("in create markers")
    var bounds = new google.maps.LatLngBounds();
    let place;
    var infoWindowContent;

    const body = document.querySelector('body')
    const detailDiv = document.getElementById('details')
    detailDiv.style.display = 'none';

    body.appendChild(detailDiv)

    for (var i = 0; i < 10; i++) {
      place = places[i]

      var request = {
        placeId: place.place_id,
        fields: ['website', 'formatted_phone_number', 'rating', 'name', 'url', 'photos', 'formatted_address', 'geometry', 'place_id', 'price_level', 'opening_hours']
      }

      service = new google.maps.places.PlacesService(map);
      service.getDetails(request, function (place, status){
        if (status == google.maps.places.PlacesServiceStatus.OK){
          // console.log('placeId', place.place_id)
          var panel = document.getElementById('panel');

          var div = document.createElement('div');
          div.dataset.placeId = place.place_id
          var iconsDiv = document.createElement('div');

          var imgDiv = document.createElement('div');
          var h2 = document.createElement('h2')
          var p = document.createElement('p');
          var websiteIcon = document.createElement('img');
          var aWebsite = document.createElement('a');
          var urlIcon = document.createElement('img');
          var aUrl = document.createElement('a');
          var photoImg = document.createElement('img');
          const hoursDiv = document.createElement('div');
          
          hoursDiv.className = "hours-div"

          if (place.opening_hours.weekday_text !== undefined){
            for (const hours of place.opening_hours.weekday_text){
              const p = document.createElement('p');
              p.textContent = hours
              hoursDiv.append(p)
            }
          }

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
            aWebsite.href = "#";
          }
          aWebsite.target = "_blank"
          aWebsite.appendChild(websiteIcon);
          iconsDiv.append(aWebsite);

          div.className = "ice-cream-list";
          p.textContent = place.formatted_address
          h2.textContent = `${place.name}`;
          div.append(h2, imgDiv, iconsDiv, p, hoursDiv);
          panel.appendChild(div);

          div.addEventListener('click', (event) => {
            console.log("Place Details--------------------", place.opening_hours.weekday_text)
            createRestaurant(event, place);
          })

        }
        else{
          // console.log(status);
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
      
      google.maps.event.addListener(marker, 'click', function() {
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




function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
  Swal.fire({
    type: 'error',
    title: 'If you need that ice-cream, we need your location',
    text: 'Please refresh and allow location services',
})
}

const createRestaurant = (event, place) =>{
  const reqObj = {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      place_id: place.place_id
    })
  }

  fetch('http://localhost:3000/restaurants', reqObj)
  .then(resp => resp.json())
  .then(json => storeRestaurant(event, json, place));
}

const storeRestaurant = (event, restaurant, place) => {
  // console.log(restaurant)
  restObj = restaurant;
  toggleHiddenDiv(event, place)  
  const contentDiv = document.getElementById(`${divCount}-content-div`);
  // console.log(restaurant.comments)
  

  if (restaurant.comments.length > 0){
    console.log()
    restObj.comments.forEach(comment => {
      console.log("this is a comment", comment)
      console.log(contentDiv)
      contentDiv.append(makeComment(comment))
    });
  }
}

const createComment = event =>{
  const commentText = event.target.parentNode.children[0].value
  event.target.parentNode.children[0].value = ""

  const commentLog = event.target.parentNode.parentNode.children[6]
  console.log(username)

  if (username !== "" && commentText !== ""){
    console
    console.log(username)
    const reqObj = {
      method: "POST",
      headers:{
        "Content-type": "application/json"
      },
      body: JSON.stringify ({
        content: commentText,
        user_id: globalUserObj.id,
        restaurant_id: restObj.id,
        username: username
      })
    }
    fetch("http://localhost:3000/comments", reqObj)
    .then(resp => resp.json())
    .then(json => commentLog.append(makeComment(json)))
  }
  else if (username === ""){
    Swal.fire({
      title: 'Enter Your Username',
      input: 'text',
      inputAttributes: {
      autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Log In',
      showLoaderOnConfirm: true,
      preConfirm: (username) => {
          return fetch("http://localhost:3000/users", {
              method: "POST",
              headers: {
                  "Content-type": "application/json"
              },
              body: JSON.stringify({
                  username: username
              })
          })
          .then(response => {
              return response.json()
          })
          .then(json => {
              if (json.name === ""){
                  Swal.showValidationMessage(
                      "Please enter a username"
                  )
              }
              else{
                  loggedIn(json)
              }
          })
          .catch(error => {
              console.log(error)
              Swal.showValidationMessage(
              "There was an error retrieving your username"
              )
          })
      }
  })
  }
  else if (commentText === ""){
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: "You didn't write anything!?",
    })
  }
}

const makeComment = commentObj =>{
  console.log('hi', commentObj)
  const p = document.createElement('p');
  p.style.backgroundColor = '#B16E4B'
  p.style.border = '2px solid 333'
  p.style.borderRadius = '5px'
  p.style.margin ='18px'
  p.style.padding = '10px'
  p.style.textAlign = 'left'
  p.style.color = "#FFF1E0"
  p.textContent = `${commentObj.username}: ${commentObj.content}`
  return p
}

const likeRestaurant = (event, place) => {
  console.log(place)
  console.log(globalUserObj.id)
  console.log(restObj.id)
  if (username === ""){
    Swal.fire({
      title: 'Enter Your Username',
      input: 'text',
      inputAttributes: {
      autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Log In',
      showLoaderOnConfirm: true,
      preConfirm: (username) => {
          return fetch("http://localhost:3000/users", {
              method: "POST",
              headers: {
                  "Content-type": "application/json"
              },
              body: JSON.stringify({
                  username: username
              })
          })
          .then(response => {
              return response.json()
          })
          .then(json => {
              if (json.name === ""){
                  Swal.showValidationMessage(
                      "Please enter a username"
                  )
              }
              else{
                  loggedIn(json)
              }
          })
          .catch(error => {
              console.log(error)
              Swal.showValidationMessage(
              "There was an error retrieving your username"
              )
          })
      }
    })
  }
  else{
    reqObj = {
      method: "POST",
      headers:{
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        user_id: globalUserObj.id,
        restaurant_id: restObj.id
      })
    }

    fetch("http://localhost:3000/likes", reqObj)
    .then(resp => resp.json())  
    .then(json => console.log(json))
    event.target.innerHTML = "♥"
    likesRestIds.push(restObj.id)
  }
}

const getLikeId = (event, place) => {
  if (username === ""){
    Swal.fire({
      title: 'Enter Your Username',
      input: 'text',
      inputAttributes: {
      autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Log In',
      showLoaderOnConfirm: true,
      preConfirm: (username) => {
          return fetch("http://localhost:3000/users", {
              method: "POST",
              headers: {
                  "Content-type": "application/json"
              },
              body: JSON.stringify({
                  username: username
              })
          })
          .then(response => {
              return response.json()
          })
          .then(json => {
              if (json.name === ""){
                  Swal.showValidationMessage(
                      "Please enter a username"
                  )
              }
              else{
                  loggedIn(json)
              }
          })
          .catch(error => {
              console.log(error)
              Swal.showValidationMessage(
              "There was an error retrieving your username"
              )
          })
      }
    })
  }
  else{

    reqObj = {
      method: "POST",
      headers:{
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        user_id: globalUserObj.id,
        restaurant_id: restObj.id
      })
    }

    fetch(`http://localhost:3000/likes/`, reqObj)
    .then(resp => resp.json())  
    .then(json => {
      console.log(json)
      unLikeRestaurant(json, event)
    })
}
}

const unLikeRestaurant = (likeObj, event) => {
  reqObj = {
    method: "DELETE",
    headers:{
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      user_id: globalUserObj.id,
      restaurant_id: restObj.id
    })
  }

  fetch(`http://localhost:3000/likes/${likeObj.id}`, reqObj)
  .then(resp => resp.json())  
  .then(json => {
    console.log("deleted", json)
  })

  console.log(likesRestIds);
  event.target.innerHTML = "♡"

  likesRestIds = likesRestIds.filter(function(value){
    console.log("in filter", value, likeObj.id)
    return value !== restObj.id;
  });
  console.log(likesRestIds);

}

const toggleHiddenDiv = (event, place) => {
  // console.log('place', place)
  const detailDiv = document.getElementById('details')
  console.log()
  divCount++;

  // console.log('hit createRestaurant')

  panel.style.display = 'none'
  const i = document.createElement('i')
  i.className = "fas fa-arrow-circle-left fa-3x"
  // i.style.width = '50px'
  // i.style.height = '50px'
  detailDiv.style.display = glyphState[detailDiv.style.display]
  detailDiv.innerHTML = ''
  
  const div1 = document.createElement('div')
  div1.className = "ice-cream-list";

  const p1 = document.createElement('p')
  p1.textContent = place.formatted_address

  const h2show = document.createElement('h2')
  h2show.textContent = `${place.name}`;

  var imgDivshow = document.createElement('div');
  var photoImgshow = document.createElement('img');;

  photoImgshow.className = "ice-cream-list-pic"
  photoImgshow.src = place.photos[2].getUrl();
  photoImgshow.width = "200";
  photoImgshow.height = "200";

  imgDivshow.append(photoImgshow);
  
  var iconsDivshow = document.createElement('div');

  const likeDiv = document.createElement('div')
  const likeBtn = document.createElement('button')
  likeBtn.style.fontSize = '40px';
  likeBtn.style.borderRadius = '10px';
  likeBtn.style.outline = 'none';
  if (username === ""){
    likeBtn.innerHTML = "♡"
  }
  else if (likesRestIds.includes(restObj.id)){
    console.log("in button assignment", likesRestIds, restObj.id)
    likeBtn.innerHTML = "♥"
  } else{
    likeBtn.innerHTML = "♡"
  }
  likeBtn.id = `${divCount}-like-button`
  likeBtn.addEventListener("click", (event) => {
    if (likesRestIds.includes(restObj.id)){
      getLikeId(event, place)
    } else{
      likeRestaurant(event, place)
    }
  })

  likeDiv.append(likeBtn)
  likeDiv.style.textAlign = 'center'

  const commentsDiv = document.createElement('div')
  commentsDiv.className = "comments-div"
  commentsDiv.style.backgroundColor = "#e9c4bc"
  commentsDiv.style.height = '200px'
  commentsDiv.style.overflowY = 'auto';
  const h2 = document.createElement('h2')
  h2.style.color = "black"
  h2.innerText = "Comments:"
  const contentDiv = document.createElement('div')
  console.log(restObj)
  contentDiv.id = `${divCount}-content-div`
  // content.style.color = 'black'
  // content.textContent = "No Comment"
  
  const commentText = document.createElement('textarea')
  commentText.className = "comment-text"

  const commentBtn = document.createElement('button');
  commentBtn.className = "comment-button"

  commentBtn.addEventListener('click', (event) => {
    createComment(event);
  })
  commentBtn.innerHTML = "Comment";

  // console.log(restObj)
  const submitComment = document.createElement('div')

  submitComment.append(commentText, commentBtn);

  commentsDiv.append(h2, contentDiv);

  div1.append(i, h2show, imgDivshow, iconsDivshow, p1, likeDiv, commentsDiv, submitComment);


  detailDiv.appendChild(div1);

  i.addEventListener('click', (e) => {
    detailDiv.style.display = glyphState[detailDiv.style.display]
    panel.style.display = ''
  })
}