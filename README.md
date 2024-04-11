# airbnb-api
{
      "endpoint": "require a current user to be logged in",
      "request": {
        "method": "GET",
        "URL": "/login",
      }
}
{
    "endpoint": "requires authentification and user does not have correct permissions",
    "request": {
      "method": "GET",
      "URL": "/login/error"

    }
  }
  {
    "endpoint": "user has logged in",
    "request": {
      "method": "GET",
      "URL": "/login/:user"
    }
  }
  {
    "endpoint": "user has logged in",
    "request": {
      "method": "GET",
      "URL": "/login/:user"
    }
  }
  {
    "endpoint": "creates new user, logs in as current user, returns user info",
    "request": {
      "method": "POST",
      "URL": "/login/:user"
    }
  }
  {
    "endpoint": "returns all spots",
    "request": {
      "method": "GET",
      "URL": "/spots"
    }
  }
  {
    "endpoint": "returns all spots created by current user",
    "request": {
      "method": "GET",
      "URL": "/login/:user/spots"
    }
  }
  {
    "endpoint": "details of a spot, specified by it's id",
    "request": {
      "method": "GET",
      "URL": "/spots/:spot"
    }
  }
  {
    "endpoint": "creates and returns a new spot",
    "request": {
      "method": "POST",
      "URL": "/spots/:spot"
    }
  }
  {
    "endpoint": "creates and returns new image for spot by id",
    "request": {
      "method": "POST",
      "URL": "/spots/:spot/image"
    }
  }
  {
    "endpoint": "updates and return existing spot",
    "request": {
      "method": "PUT",
      "URL": "/spots/:spot"
    }
  }
  {
    "endpoint": "deletes existing spot",
    "request": {
      "method": "DELETE",
      "URL": "/spots/:spot"
    }
  }
  {
    "endpoint": "returns all reviews by current user",
    "request": {
      "method": "GET",
      "URL": "/:user/reviews"
    }
  }
  {
    "endpoint": "returns reviews for spot by spot id",
    "request": {
      "method": "GET",
      "URL": "/spots/:spot/reviews"
    }
  }
  {
    "endpoint": "create and return new review for a spot specified by spot id",
    "request": {
      "method": "POST",
      "URL": "/spots/:spot/reviews/:review"
    }
  }
  {
    "endpoint": "create and return new image for a review specified by review id",
    "request": {
      "method": "POST",
      "URL": "/:review/image"
    }
  }
  {
    "endpoint": "update and return existing review by current user",
    "request": {
      "method": "PUT",
      "URL": "/:user/reviews/:review"
    }
  }
  {
    "endpoint": "delete an existing review owned by current user",
    "request": {
      "method": "DELETE",
      "URL": "/:user/reviews/:review"
    }
  }
  {
    "endpoint": "return all bookings current user has made",
    "request": {
      "method": "GET",
      "URL": "/:user/bookings"
    }
  }
  {
    "endpoint": "return all bookings for a spot specified by spot id",
    "request": {
      "method": "GET",
      "URL": "/:spot/bookings"
    }
  }
  {
    "endpoint": "create and return a new booking for a spot by current user specified by spot id",
    "request": {
      "method": "POST",
      "URL": "/:user/bookings/:booking"
    }
  }
  {
    "endpoint": "update and return an existing booking",
    "request": {
      "method": "PUT",
      "URL": "/:user/bookings/:booking"
    }
  }
  {
    "endpoint": "delete an existing booking",
    "request": {
      "method": "DELETE",
      "URL": "/:user/bookings/:booking"
    }
  }
  {
    "endpoint": "delete an existing image for a spot owned by current user",
    "request": {
      "method": "DELETE",
      "URL": "/:spot/images/:image"
    }
  }
  {
    "endpoint": "delelte an existing image review owned by current user",
    "request": {
      "method": "DELETE",
      "URL": "/:user/reviews/:review/:image"
    }
  }
  {
    "endpoint": "return spots filtered by query params",
    "request": {
      "method": "GET",
      "URL": "/spots/:filtered"
    }
  }


  Table spots {
  id integer [primary key]
  ownerId integer
  address varchar
  city varchar
  state varchar
  country varchar
  lat float
  lng float
  name varchar
  description varchar
  price float
  createdAt date
  updatedAt date
  avgRating float
  previewImage varchar?
  booking_start
  booking_end
  created_at timestamp
}

Table users {
    id integer [primary key]
    firstName varchar
    lastName varchar
    email varchar
    username varchar
    created_at timestamp
    updated_at timestamp
}

Table reviews {
    id integer [primary key]
    review varchar
    stars float
    created_at timestamp
    updated_at timestamp
    spot_id integer
    user_id integer
}

Table bookings {
    id integer [primary key]
    spot_id integer
    start_date timestamp
    end_date timestamp
    user_id integer
    created_at timestamp
    updated_at timestamp
}

Table review_images {
    id integer [primary key]
    url varchar
    review_id integer
    created_at timestamp
    updated_at timestamp
}

Table spot_images {
    id integer [primary key]
    url varchar
    spot_id integer
    created_at timestamp
    updated_at timestamp
}

Ref: spots.id < spot_images.spot_id
Ref: spots.id < bookings.spot_id
Ref: spots.id < reviews.spot_id
Ref: reviews.id < review_images.review_id
Ref: users.id < bookings.user_id
Ref: users.id < reviews.user_id

