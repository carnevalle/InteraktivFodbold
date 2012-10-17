dpd.clubs.get({id: this.hometeam}, function(team) {
    this.hometeam = team;
});

dpd.clubs.get({id: this.awayteam}, function(team) {
    this.awayteam = team;
});