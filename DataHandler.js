var mongoose=require('mongoose');
var Event=mongoose.model('Event');

//var testdata=new Event({lat:43.640858, lon:-79.388882,type:"homicide",decription:"test",link:"andrewcodispoti.me",time:Date()});
//var testdata2=new Event({lat:43.640858, lon:-79.388882,type:"homicide",decription:"test",link:"andrewcodispoti.me",time:Date()});

testdata.save();
testdata2.save();

//call in app.js to get all events close
function getDataForLocation(location,res){
    console.log("getting data for location");
    var relevantEvents=[];
	Event.find(function(err,events){
        console.log("searched stuff");
        for (x in events){
            console.log("event found");
            if(Math.abs(getDistance(events[x].lat,events[x].lon,location.lat,location.lon))<50000){
                relevantEvents.push(events[x]);
            }
        }
        console.log("done iterating");
        res.send(relevantEvents);
    });
}
function getDistance(lon1,lat1,lon2,lat2){
    R=6335.437*1000;
    dlon = lon2 - lon1;
    dlat = lat2 - lat1;
    a = Math.pow((Math.sin(dlat/2)),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin(dlon/2)),2);
    c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
    d = R * c;
    return (d);
}
module.exports.getDataForLocation=getDataForLocation;
