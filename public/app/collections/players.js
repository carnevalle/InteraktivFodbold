var Players = Backbone.Collection.extend({
	model: Player,

	url: "./players?club=brondby",

	comparator: function(player){
		return -player.get("highfives")/1000;
	},

	parse: function(response){
		return response;
	}
})