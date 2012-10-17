dpd.players.put(this.playerid, {"highfives":{$inc: -this.number}}, function(result, err) {
  if(err) return console.log(err);
  console.log(result, result.id);
});    

emit('player:highfived', this);