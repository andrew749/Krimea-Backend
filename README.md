##signup
curl "localhost:8000/signup" -d "email=andrewcod749@gmail.com&password=hello"

##create panic

curl "localhost:8000/panic" -u "andrewcod749@gmail.com:hello" -X POST

##update location

curl "localhost:8000/panic/panic_id/update" -u "andrewcod749@gmail.com:hello" -X POST -d "lat=latitude&lon=longitude"

##/panic/panic_id/locations

curl "localhost:8000/panic/panic_id/locations"

