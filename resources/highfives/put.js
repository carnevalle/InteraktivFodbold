if(!me){
    cancel('You are not logged in', 401);
}

// 15 minutes in milliseconds
var deadzone = 900000;
var currenttime = new Date().getTime();

/*
if(currenttime-this.timestamp < deadzone){
    error("number", "You can only give a highfive to the same player every 15 minutes");
}
*/

this.timestamp = currenttime;
this.number += 1;

var totalHighfives = 0;
dpd.highfives.get({"playerid":this.playerid}, function (highfives) {
    highfives.forEach(function(highfive){
        totalHighfives += highfive.number;
    });
    
    dpd.players.put(this.playerid, {"highfives":totalHighfives}, function(result, err) {
      if(err) return console.log(err);
      console.log(result, result.id);
    });    
});

emit('player:highfived', this);