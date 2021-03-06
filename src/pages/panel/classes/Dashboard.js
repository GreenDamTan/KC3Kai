KC3.prototype.Dashboard  = {
	state: "waiting",
	
	/* Dashboard Initialization
	-------------------------------------------------------*/
	init :function(){
		var self = this;
		
		// Load theme HTML
		$.ajax({
			url: 'themes/horizontal.html',
			success: function(response){
				$("#panel-wrap").html(response);
				
				// Apply panel box opacity
				var oldBG = $(".theme-box").css("background-color");
				var newBG = oldBG.insert( oldBG.length-1, ", "+(app.Config.panelAlpha/100) );
				newBG = newBG.insert(3, "a"); // "rgb" -> "rgba"
				$(".theme-box").css("background-color", newBG);
				
				self.ready();
			}
		});
	},
	
	/* Document Ready
	-------------------------------------------------------*/
	ready: function(){
		var self = this;
		
		// CatBomb modal close
		$("#catBomb .closebtn").on("click", function(){
			$("#catBomb").fadeOut(500);
			$("#modals").fadeOut(500);
		});
		
		// Crafting modal close
		$("#craftModal").on("click", function(){
			$(this).fadeOut(500);
			$("#modals").fadeOut(500);
		});
		
		// Compass modal close
		$("#compassModal").on("click", function(){
			$(this).fadeOut(500);
			$("#modals").fadeOut(500);
		});
		
		// Battle modal close
		$("#battleModal").on("click", function(){
			$(this).fadeOut(500);
			$("#modals").fadeOut(500);
		});
		
		// Choose fleets
		$(".fleet-button").on("click", function(){
			$(".fleet-button").removeClass("active");
			$(this).addClass("active");
			app.Dashboard.Fleet.selectedFleet = $(this).data("id");
			app.Dashboard.Fleet.update();
		});
		
		// EqLos Formula Change
		$(".fleet-summary .summary-eqlos").on("click", function(){
			app.Config.scrollElosMode();
			self.updateElosIcon();
			self.Fleet.update();
		});
		
		// Share compo button
		$(".screenshot-button").on('click', function(){
			$(this).hide();
			$(".screenshot-mode").text("OK");
			$(".screenshot-mode").show();
			setTimeout(function(){
				$(".screenshot-button").show();
				$(".screenshot-mode").hide();
			}, 200);
			self.takeScreenshot();
		});
		
		// Strategy Room
		$(".btn-strategy").on('click', function(){
			window.open("../strategy/strategy.html", "kc4_strategy");
		});
		
		// Take a Screenshot
		$(".btn-screenshot").on('click', function(){
			
		});
		
		// Dev-mode button to Reset IndexedDB
		$(".idfreset").on("click", function(){
			app.Logging.reset();
		});
		$(".cbomb").on("click", function(){
			self.catBomb("A", "Bjasb hdjkabhs djkhb asjdb jkfbajkd bhjka dbhcfjk awbh dukfhb wdkjhqv bfiou pwidv Bjasb hdjkabhs djkhb asjdb jkfbajkd bhjka dbhcfjk awbh dukfhb wdkjhqv bfiou pwidv");
		});
		$(".actbox").on("click", function(){
			self.messageBox("A");
		});
		$(".openpanel").on("click", function(){
			self.showPanel();
		});
		$(".craftmod").on("click", function(){
			self.showCraft({"api_create_flag":1,"api_shizai_flag":1,"api_slot_item":{"api_id":8869,"api_slotitem_id":20},"api_material":[105747,129789,216983,24437,577,408,739,49],"api_type3":6,"api_unsetslot":[8630,8663,8694,8869,6728,5385,8450,4985,6471,7947,8455,7175,8171,8140,4464,6327]}, [20,20,10,90]);
		});
		$(".compassmod").on("click", function(){
			self.showCompass(6);
		});
	},
	
	/* Update EqLos Icon on change Formula
	-------------------------------------------------------*/
	updateElosIcon :function(){
		$(".fleet-summary .summary-eqlos .summary-icon img").attr(
			"src",
			"../../assets/img/stats/los"+app.Config.elos_mode+".png"
		);
	},
	
	/* Custom message boxes
	-------------------------------------------------------*/
	messageBox :function(message){
		$("#messageBox .title").text(message);
		$("#panel-wrap").hide();
		$("#messageBox").show();
	},
	
	/* Show CatBomb debugger screen
	-------------------------------------------------------*/
	catBomb :function(title, message){
		this.checkModals();
		$("#catBomb .title").text(title);
		$("#catBomb .description").text(message);
		$("#modals").fadeIn(300);
		$("#catBomb").fadeIn(300);
	},
	
	/* Show Quest Progress
	-------------------------------------------------------*/
	showQuestProgress :function(questData){
		this.checkModals();
		console.log("showQuestProgress", questData);
	},
	
	/* Show Development Results
	-------------------------------------------------------*/
	showCraft :function(craftData, resourceUsed, MasterItem){
		this.checkModals();
		$("#modals").fadeIn(300);
		$("#craftModal").fadeIn(300);
		
		// Show basic info of the item
		$("#craftModal .equipIcon img").attr("src", "../../assets/img/items/"+MasterItem.api_type[3]+".png");
		$("#craftModal .equipName").text(MasterItem.english);
		$("#craftModal .equipJapanese").text(MasterItem.api_name);
		
		// Show item stats
		var statHtml = "";
		statHtml += this.checkEquipForStats(MasterItem, "souk", "ar");
		statHtml += this.checkEquipForStats(MasterItem, "houg", "fp");
		statHtml += this.checkEquipForStats(MasterItem, "raig", "tp");
		statHtml += this.checkEquipForStats(MasterItem, "soku", "sp");
		statHtml += this.checkEquipForStats(MasterItem, "baku", "dv");
		statHtml += this.checkEquipForStats(MasterItem, "tyku", "aa");
		statHtml += this.checkEquipForStats(MasterItem, "tais", "as");
		statHtml += this.checkEquipForStats(MasterItem, "houm", "ht");
		statHtml += this.checkEquipForStats(MasterItem, "houk", "ev");
		statHtml += this.checkEquipForStats(MasterItem, "saku", "ls");
		statHtml += this.checkEquipForStats(MasterItem, "leng", "rn");
		$("#craftModal .equipStats").html(statHtml);
		
		// Show extra item info
		var countExisting = app.Gears.countByType(MasterItem.api_id);
		if(countExisting == 0){
			$("#craftModal .equipText").html("This is your <strong>first</strong> of this equipment!");
		}else{
			$("#craftModal .equipText").html("You already have <strong>"+countExisting+"</strong> of this equipment, +1!");
		}
		
		// Show resource used
		$("#craftModal .equse_fuel .equipResourceValue").text(resourceUsed[0]);
		$("#craftModal .equse_ammo .equipResourceValue").text(resourceUsed[1]);
		$("#craftModal .equse_steel .equipResourceValue").text(resourceUsed[2]);
		$("#craftModal .equse_baux .equipResourceValue").text(resourceUsed[3]);
		
		$("#craftModal").fadeIn();
	},
	
	checkEquipForStats :function(master, stat, code){
		if(master["api_"+stat] != 0){
			return "<img src=\"../../assets/img/stats/"+code+".png\" /> "+master["api_"+stat]+" ";
		}else{
			return "";
		}
	},
	
	showBattleModal : function(battleData) {
		this.checkModals();
		$("#modals").fadeIn(300);
		$("#battleModal").fadeIn(300);
		
		$("#battleModal .battle-value").removeClass("good");
		$("#battleModal .battle-value").removeClass("bad");
		
		// Show detection
		var detection = app.Meta.detection(battleData.api_search[0]);
		$("#battleModal #detect").html( "&nbsp;" + detection[0] );
		if ( detection[1] != "" ) { 
			$("#battleModal #detect").addClass( detection[1] ); 
		}
		
		// Show Air Battle result
		var airbattle = app.Meta.airbattle(battleData.api_kouku.api_stage1.api_disp_seiku);
		$("#battleModal #air-battle").html( "&nbsp;" + airbattle[2] );
		if ( airbattle[1] != "" ) { 
			$("#battleModal #air-battle").addClass( airbattle[1] ); 
		}
		
		// Engagement
		var engagement = app.Meta.engagement( battleData.api_formation[2] );
		$("#battleModal #engage").html( "&nbsp;" + engagement[2] );
		if ( engagement[1] != "" ) { 
			$("#battleModal #engage").addClass( engagement[1] ); 
		}
		
		var allyPlaneBefore = battleData.api_kouku.api_stage1.api_f_count;
		var allyPlaneAfter = allyPlaneBefore - battleData.api_kouku.api_stage1.api_f_lostcount;
		$("#battleModal #ally-fighters").html("<img src=\"../../assets/img/items/6.png\" alt=\"Fighters\">" + allyPlaneBefore + " <img src=\"../../assets/img/ui/arrow.png\" alt=\"=>\"> " + allyPlaneAfter);
		
		var enemyPlaneBefore = battleData.api_kouku.api_stage1.api_e_count;
		var enemyPlaneAfter = enemyPlaneBefore - battleData.api_kouku.api_stage1.api_e_lostcount;
		$("#battleModal #enemy-fighters").html("<img src=\"../../assets/img/items/6.png\" alt=\"Fighters\">" + enemyPlaneBefore + " <img src=\"../../assets/img/ui/arrow.png\" alt=\"=>\"> " + enemyPlaneAfter);
		
		
		
		if (typeof battleData.api_kouku.api_stage2 != "undefined") {
			allyPlaneBefore = battleData.api_kouku.api_stage2.api_f_count;
			allyPlaneAfter = allyPlaneBefore - battleData.api_kouku.api_stage2.api_f_lostcount;
			$("#battleModal #ally-bombers").html("<img src=\"../../assets/img/items/7.png\" alt=\"Bombers\">" + allyPlaneBefore + " <img src=\"../../assets/img/ui/arrow.png\" alt=\"=>\"> " + allyPlaneAfter);
			
			enemyPlaneBefore = battleData.api_kouku.api_stage2.api_e_count;
			enemyPlaneAfter = enemyPlaneBefore - battleData.api_kouku.api_stage2.api_e_lostcount;
			$("#battleModal #enemy-bombers").html("<img src=\"../../assets/img/items/7.png\" alt=\"Bombers\">" + enemyPlaneBefore + " <img src=\"../../assets/img/ui/arrow.png\" alt=\"=>\"> " + enemyPlaneAfter);
		} else {
			$("#battleModal #ally-bombers").html("");
			$("#battleModal #enemy-bombers").html("");
		}
	},
	
	/* Show Compass Results
	-------------------------------------------------------*/
	showCompass :function(nodeData){
		this.checkModals();
		$("#modals").fadeIn(300);
		$("#compassModal").fadeIn(300);
		$("#compassModal .nodeLetter").text(String.fromCharCode(nodeData.api_no+96).toUpperCase());
		
		$("#compassModal .enemy-label").html("");
		$("#compassModal .enemy-formation").html("");
		$("#compassModal .enemy-ships").html("");
		$("#compassModal .itemGet").html("");
		
		if (typeof nodeData.api_enemy != "undefined") {              // Check if enemy node
			var mapArea = nodeData.api_maparea_id;
			var mapNo = nodeData.api_mapinfo_no;
			var battleNode = nodeData.api_no;
			var enemyId = nodeData.api_enemy.api_enemy_id;
			var enemyText = "";
			
			app.Logging.get_battle(mapArea, mapNo, battleNode, enemyId, function(battle){
				if (battle) {
					$("#compassModal .enemy-formation").html("<img src=\"../../assets/img/formation/" + battle.data.api_formation[1] + ".jpg\"/>");
					for (var i = 1; i <= 6; i++) {
						if (battle.data.api_ship_ke[i] > -1) {
							enemyUrl = app.Assets.abyssIcon(battle.data.api_ship_ke[i], "");
							enemyText += "<img class=\"enemy-img\" src=\"" + enemyUrl + "\" alt=\"" + battle.data.api_ship_ke[i] + "\"/>";
						}
						if (i==3) {
							enemyText += "<br>";
						}
					}
					$("#compassModal .enemy-ships").html(enemyText);
				} else {
					//enemyText = "Unknown Enemy";
					$("#compassModal .enemy-label").html("Unknown Enemy");
				}
				//$("#compassModal .enemy-label").html("Enemy #" + nodeData.api_enemy.api_enemy_id);
				
			});
			
		} else if (typeof nodeData.api_itemget != "undefined") {     // Check if resource node
			var iconFile;
			switch(nodeData.api_itemget.api_icon_id){
				case 1: iconFile = "../../assets/img/client/fuel.png"; break;
				case 2: iconFile = "../../assets/img/client/ammo.png"; break;
				case 3: iconFile = "../../assets/img/client/steel.png"; break;
				case 4: iconFile = "../../assets/img/client/bauxite.png"; break;
				case 5: iconFile = "../../assets/img/client/ibuild.png"; break;
				case 6: iconFile = "../../assets/img/client/bucket.png"; break;
				case 7: iconFile = "../../assets/img/client/devmat.png"; break;
				default: iconFile = "../../assets/img/client/compass.png"; break;
			}
			$("#compassModal .itemGet").html("<img src=\""+iconFile+"\" /> "+nodeData.api_itemget.api_getcount);
			
		} else if (typeof nodeData.api_itemget_eo_comment != "undefined") {     // Check if special resource node (1-6 Boss Node)
			var iconFile;
			switch(nodeData.api_itemget_eo_comment.api_id){
				case 1: iconFile = "../../assets/img/client/fuel.png"; break;
				case 2: iconFile = "../../assets/img/client/ammo.png"; break;
				case 3: iconFile = "../../assets/img/client/steel.png"; break;
				case 4: iconFile = "../../assets/img/client/bauxite.png"; break;
				case 5: iconFile = "../../assets/img/client/ibuild.png"; break;
				case 6: iconFile = "../../assets/img/client/bucket.png"; break;
				case 7: iconFile = "../../assets/img/client/devmat.png"; break;
				default: iconFile = "../../assets/img/client/compass.png"; break;
			}
			$("#compassModal .itemGet").html("<img src=\""+iconFile+"\" /> "+nodeData.api_itemget_eo_comment.api_getcount);
			   
		} else if (typeof nodeData.api_happening != "undefined") {  // Check if malstrom node
			var iconFile;
			switch(nodeData.api_happening.api_icon_id){
				case 1: iconFile = "../../assets/img/client/fuel.png"; break;
				case 2: iconFile = "../../assets/img/client/ammo.png"; break;
				case 3: iconFile = "../../assets/img/client/steel.png"; break;
				case 4: iconFile = "../../assets/img/client/bauxite.png"; break;
				default: iconFile = "../../assets/img/client/compass.png"; break;
			}
			$("#compassModal .itemGet").html("<img src=\""+iconFile+"\" /> -"+nodeData.api_happening.api_count);
			
		} else {
			$("#compassModal .enemy-label").html("Battle Avoided");
		}
	},
	
	/* If a modal is already visible, close it
	-------------------------------------------------------*/
	checkModals :function(){
		if($("#modals").is(":visible")){
			$("#modals").hide();
			$("#modals .box").hide();
		}
	},
	
	/* Attempt to show dashboard
	-------------------------------------------------------*/
	showPanel :function(){
		if(this.state != "playing" && this.state!="dead"){
			if(app.Master.available){
				this.state = "playing";
				$("#messageBox").hide();
				$("#panel-wrap").show();
			}else{
				this.state = "dead";
				this.messageBox("Refresh the game to view this panel!");
			}
		}
	},
	
	/* Screenshot Tool
	-------------------------------------------------------*/
	takeScreenshot :function(){
		// Ask background page to ask game container to take screenshot
		chrome.runtime.sendMessage({
			game:"kancolle",
			type:"background",
			action:"screenshot",
			tabId: chrome.devtools.inspectedWindow.tabId,
			playerIndex: app.Player.id
		});
	},
	
	/* Update quest boxes
	-------------------------------------------------------*/
	showQuests :function(){
		app.Quests.load();
		$(".theme-box .box-quests-list").html("");
		var ctr, questId, tmpBox;
		for(ctr in app.Quests.active){
			questId = app.Quests.active[ctr];
			questData = app.Quests.list["q"+questId];
			questMeta = app.Meta.quest(questId);
			tmpBox = $(".theme-box .factory .box-quest").clone().appendTo(".theme-box .box-quests-list");
			tmpBox.attr("title", questMeta.desc);
			tmpBox.text(questMeta.code);
			tmpBox.addClass("type"+(String(questId).substring(0,1)));
		}
	}
	
};