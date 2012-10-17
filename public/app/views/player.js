/*
var PlayerView = Backbone.View.extend({
	
	initialize: function() { 
		this.model.bind('change', this.render, this);
	},

	render: function(){
		console.log("I want to render");
		this.$el.html( _.template( $("#template-players").html(), this.model.toJSON() ) );

		$("#players ul").append(this.$el);
	}
});
*/