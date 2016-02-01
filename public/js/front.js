var application = {
	config : {
		url : "/"
	},
	init : function(){
		this.watchers();
	},

	watchers : function(){
		var self = this;
		$("[ligne]").on('click', function(){
			var atr = $(this).attr("ligne");
			console.log(atr);
			self.get(atr);
		});
		$("body").on('click','#liste_arret a', function(e){
			e.preventDefault();
			var id = $(this).attr('data-id');
			self.update(application.node.arrets[id]);

		});
	},

	get : function(clef) {
		$.getJSON("/", function(data){
			application.node = data[clef];
			application.showarrets(application.node.arrets);
		});
	},

	showarrets : function(liste){
		var len = liste.length;
		var $table = $('#liste_arret table');
		for(var i = 0; i < len; i++) {
			console.log(liste[i]);
			var arret = (liste[i]);
			var tpl = $('<tr><td><a href="#" data-id="'+ i +'"> '+ arret.name +'</a></td></tr>');
			$table.append(tpl);
		}
	},

	update : function(arret) {
		$("#nomarret").html(arret.name);
		this.showhoraires(arret.horaires);
	},

	showhoraires: function(liste){
       
       var len = liste.length; // on compte toujours avant la boucle > pr performance
       var $table = $ ("#infoarret table");
       var out = [];
       for (var i = 0; i < len ; i++){
		out.push('<tr><td>'+liste[i]+'</td></tr>');
       }
       $table.html(out.join(" "));
   },

};
application.init();