var PlayerView = Backbone.Marionette.ItemView.extend({
	template: "#template-player",
	tagName: "div",
	className: "player tradingcard"
});
var PlayerCollectionView = Backbone.Marionette.CollectionView.extend({
	itemView: PlayerView,
	template: "#template-player",
	tagName: "div",
	className: "players",

	initialize: function(){
		console.log("Initializing player collection");
	},

	events: {
        // any user events (clicks etc) we want to respond to
        "click .btn":  "highfive",
	},

	initialEvents: function(){
		if (this.collection){
			this.bindTo(this.collection, "add", this.addChildView, this);
			this.bindTo(this.collection, "remove", this.removeItemView, this);
			//this.bindTo(this.collection, "reset", this.render, this);
		}
	},	

	highfive: function(e){
		console.log("highfiving");
		var btn = $(e.currentTarget);
		var playerid = btn.attr("data-id");
		console.log(playerid);

		var self = this;
		console.log(self);
		dpd.highfives.get({"playerid":playerid,"userid":App.user.id}, function (result) {
		    if(result.length == 0){
		    	console.log("Creating new highfive");
				dpd.highfives.post({"playerid":playerid}, function(result, err) {
				  if(err) return console.log(err);
				  console.log(result, result.id);

				  //self.collection.fetch();
				});        
		    }else{
		    	console.log("Updating highfive, ",result);
				dpd.highfives.put(result[0].id, {}, function(result, err) {
				  if(err) return console.log(err);
				  console.log(result, result.id);

				  //self.collection.fetch();
				});
		    }
		});

		e.preventDefault();
	},

	appendHtml: function(collectionView, itemView, index){
		itemView.$el.attr("id", itemView.model.get("id"));
		collectionView.$el.append(itemView.el);
	},

	onRender: function(){
		console.log("On Render Complete: ",this.collection.length);

		if(this.collection.length > 0){

			var options = {
				autoResize: true, // This will auto-update the layout when the browser window is resized.
				container: $('#main'), // Optional, used for some extra CSS styling
				offset: 15, // Optional, the distance between grid items
				itemWidth: 150 // Optional, the width of a grid item
			};

			// Get a reference to your grid items.
			var handler = $('.players > div');

			// Call the layout function.
			handler.wookmark(options);
			App.handler = handler;
		}
  	}
});

var AppController = {
	default: function(){
		console.log("default route");
		var players = new Players();
		var playerCollectionView = new PlayerCollectionView({
			collection: players
		})

		dpd.on('player:highfived', function(post) {
		    console.log("Player highfived!");
		    players.fetch({
		    	success: function(){
		    		//console.log("Fetch Complete: ", players.children, $(".player"));
		    		var playerelements = $(".player");

		    		players.each(function(player, i){
		    			var curindex = i;
		    			var oldindex = playerelements.index( $("#"+player.get("id")) )

		    			if(curindex < oldindex){
		    				console.log("I want to swap: ", $("#"+player.get("id"))[0], playerelements[curindex], $(playerelements[curindex]).attr("id"));
							$("#"+player.get("id")).swap({  
								target: $(playerelements[curindex]).attr("id"), // Mandatory. The ID of the element we want to swap with  
								opacity: "0.5", // Optional. If set will give the swapping elements a translucent effect while in motion  
								speed: 1000, // Optional. The time taken in milliseconds for the animation to occur  
								callback: function() { // Optional. Callback function once the swap is 
									//swapElements($("#"+player.get("id"))[0], $(playerelements[curindex])[0]);
								}  
							}); 
		    			}
						

		    			//console.log(player.get("id"), i, playerelements.index($("#"+player.get("id"))));
		    			$("#"+player.get("id")).html(_.template( $("#template-player").html(), player.toJSON() ));
		    		})
		    	}
		    });
		});

		playerCollectionView.on("show", function(){
			/*
			var options = {
				autoResize: true, // This will auto-update the layout when the browser window is resized.
				container: $('#main'), // Optional, used for some extra CSS styling
				offset: 15, // Optional, the distance between grid items
				itemWidth: 150 // Optional, the width of a grid item
			};

			// Get a reference to your grid items.
			var handler = $('.players > div');

			// Call the layout function.
			handler.wookmark(options);
			App.handler = handler;
			*/		
		});

		players.fetch({
			success: function(response){
				console.log(response);
				App.mainRegion.show(playerCollectionView);
			}
		})		
	}
}

var AppRouter = Backbone.Marionette.AppRouter.extend({
  controller: AppController,

  appRoutes: {
    "": "default"
  },  
});

var App = new Backbone.Marionette.Application();

App.addRegions({
	mainRegion: "#main"
});

App.on('initialize:after', function() {
	console.log("after init: ", App);

	dpd.users.me(function(user){
		App.user = user;
		console.log(App.user);
	});

	this.router = new AppRouter();
	Backbone.history.start();
})

App.start();