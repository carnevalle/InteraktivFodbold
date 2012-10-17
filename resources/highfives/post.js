if(!me){
    cancel('You are not logged in', 401);
}

// 15 minutes in milliseconds
var deadzone = 900000;
var currenttime = new Date().getTime();

dpd.players.get({id: this.playerid}, function(player) {
    if(player === null){
        error("playerid", "Can't fint player with id: "+this.playerid);
    }
    this.playerid = player.id;
});

dpd.highfives.get({"playerid":this.playerid,"userid":me.id}, function (result) {
    if(result.length > 0){
        cancel("craaaaazy!!");   
    }
});

this.userid = me.id;
this.number = 1;
this.timestamp = currenttime;

var totalHighfives = 1;
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