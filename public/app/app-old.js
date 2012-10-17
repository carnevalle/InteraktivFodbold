var InteraktivApp = {
	init : function(){
		console.log("starting the fun");

		this.checkLogin();
		$("#login").click(this.loginWithFacebook);

		//this.loadMatches();
		this.loadPlayers();
	},

	loadMatches: function(){
		dpd.matches.get(function (result, err) {
		  if(err) return console.log(err);
		  $("#matches").html( _.template($("#template-matches").html(), {matches: result} ) );
		});
	},

	loadPlayers: function(){
		var players = new Players();
		players.fetch({
			success: function(){
				players.each(function(player){
					var view = new PlayerView({model: player});
					view.render();
				})
			}
		});
	},

	checkLogin: function(){
	    dpd.users.me(function(user, error){
	    	if(user == ""){
				FB.getLoginStatus(function(response) {
					console.log("getLoginStatus: ", response);

					if (response.status === 'connected') {
						// the user is logged in and has authenticated your
						// app, and response.authResponse supplies
						// the user's ID, a valid access token, a signed
						// request, and the time the access token 
						// and signed request each expire
						var uid = response.authResponse.userID;
						var accessToken = response.authResponse.accessToken;

						var hashedid = CryptoJS.MD5( uid ).toString();
						InteraktivApp.login(hashedid, accessToken);

					} else if (response.status === 'not_authorized') {
						// the user is logged in to Facebook, 
						// but has not authenticated your app
					} else {
						// the user isn't logged in to Facebook.
					}
				 });
	    	}else{

	    	}
	    })
	},

	loginWithFacebook: function(){

		 FB.login(function(response) {
		   if (response.authResponse) {

		     console.log('Welcome!  Fetching your information.... ');
		     FB.api('/me', function(response) {
		     	console.log(response);
		     	
				var query = {"facebookid":response.id};

				dpd.users.get(query, function (result) {
					var hashedid = CryptoJS.MD5( response.id ).toString();

					if(result.length == 0){
						var user = {
							"username": hashedid, 
							"password": hashedid, 
							"facebookid": response.id,
							"name": response.name,	
							"firstname": response.first_name,
							"lastname": response.last_name						
						}

						dpd.users.post(user, function(user, err) {
						  if(err) return console.log(err);
						  InteraktivApp.login(user.username);
						});
					}else{
						var user = result[0];
						InteraktivApp.login(user.username);
					}
				});
		     });
		   } else {

		   }
		 });
	},

	login : function(username, accessToken){
		dpd.users.login({"username": username, "password": username}, function(user, err) {
			if(err) return console.log(err);

			dpd.users.me(function(user){
				if(typeof accessToken != "undefined"){
					user.accessToken = accessToken;
				}
			});
		});
	}	
}