var timer = null;			//le timer est a l'arret
var delay = 1000;			//intervalle du timer
var flagMinutes = false;	//booleen : heures et minutes a zero
var flagHours = false;		//booleen : heures a zero


function setTimerUp(){
	"use strict"
	var imgId = arguments[0];			//image a remplacer
	var imgNum = retrieveImgNum(imgId);	//numero de l'image
	var max ;							//numero maximum
	var units = arguments[2]			//booleen : on est dans les unites
	
	//si on est dans les heures et que la dizaine est a 2
	if(arguments[3]=="idHrsNmbr1" && retrieveImgNum(arguments[3])==2)
		max = 3;	//le max des unites des heures passe a 3
	//tous les autres cas
	else
		max = arguments[1];
	
	//si on a atteint le maximum
	if(imgNum==max){
		imgNum=0 ;	//on passe a 0
		//si on est dans les unites
		if(units)
			setTimerUp(arguments[3],arguments[4],false);	//on incremente les dizaines
	}
	//le maximum n'a pas ete atteint
	else{
		imgNum++;
	}
	//on remplace l'image
	document.getElementById(imgId).src = "images/"+imgNum+".png";
}


function setTimerDown(){
	"use strict"
	var imgId;		//image a remplacer
	var imgNum;		//numero de l'image
	var min = 0;	//numero minimum
	var units;		//booleen : on est dans les unites
	var imgId2;		//image des dizaines (peut etre vide)
	
	//la liste d'arguments de la fonction est vide
	//appel par setInterval (timer) qui ne transmet pas d'arguments
	if(arguments.length==0){
		imgId = "idScndsNmbr2";
		units = true;
		imgId2 = "idScndsNmbr1";
	} else{		//la fonction est appelee en transmettant des arguments
		imgId = arguments[0];
		units = arguments[1]
		imgId2 = arguments[2]
	}
	imgNum = retrieveImgNum(imgId);
	
	//si on a atteint le minimum
	if(imgNum==min){
		//si on est dans les unites
		if(units){
			//si on est dans les heures et que la dizaine est a 0 et que le timer n'a pas demarre
			if(imgId2=="idHrsNmbr1" && retrieveImgNum(imgId2)==0 && timer==null)
				imgNum=3;	//on passe les unites a 3
			//sinon on est dans les minutes ou les heures
			else{
				//si les dizaines sont a 0 et que le timer est en cours
				if(retrieveImgNum(imgId2)==0 && timer!=null){
					//test sur l'image (secondes, minutes ou heures)
					switch(imgId){
						case "idScndsNmbr2" :
							//on decremente les minutes
							setTimerDown("idMntsNmbr2",true,"idMntsNmbr1");
							//si tout est a zero
							if(retrieveImgNum("idScndsNmbr2")==0
									&& retrieveImgNum("idScndsNmbr1")==0
									&& flagMinutes && flagHours){
								stopTimer();	//on stoppe le timer
								return;			//et on sort de la fonction
							}
							break;
						case "idMntsNmbr2" :
							//on decremente les heures
							setTimerDown("idHrsNmbr2",true,"idHrsNmbr1");
							//si les minutes et les heures sont a zero
							if(retrieveImgNum("idMntsNmbr2")==0
									&& retrieveImgNum("idMntsNmbr1")==0
									&& flagHours){
								flagMinutes = true;
								return;		//on sort de la fonction
							}
							break;
						case "idHrsNmbr2" :
							//les heures sont a zero
							flagHours = true;
							return;		
					}
				}
				//on est dans les secondes ou les minutes et les dizaines ne sont pas a zero
				imgNum=9 ;	//on passe les unites a 9
			}
			//heures, minutes ou secondes, dizaines pas a zero
			setTimerDown(imgId2,false);	//on decremente les dizaines
		}
		//si on est dans les dizaines
		else{
			//si on est dans les heures et que la dizaine est a 0
			if(imgId=="idHrsNmbr1")
				imgNum=2;	//on passe les dizaines a 2
			//sinon on est dans les secondes ou les minutes, a 0
			else
				imgNum=5;	//on passe les dizaines a 5
		}
	}
	//le minimum n'a pas ete atteint
	else{
		imgNum--;
	}
	//on remplace l'image
	document.getElementById(imgId).src = "images/"+imgNum+".png";
}


function retrieveImgNum(id){
//Recupere le numero de l'image en cours
	"use strict"
	//on split le path de l'image avec les '/'
	var splitSrc = document.getElementById(id).src.split("/");
	//on recupere la premiere partie (numero) du dernier element (numero.png) 
	//et on parse en Integer
	var imgNum = parseInt(splitSrc[splitSrc.length-1].split(".")[0]);
		
	return imgNum;
}

function startTimer(){
	"use strict"
	if(timer!=null)
		return
	timer = setInterval(setTimerDown,delay);
	//array des boutons de reglages du timer
	var tabButtons = ["idScndsUpButton","idScndsDownButton","idMntsUpButton","idMntsDownButton","idHrsUpButton","idHrsDownButton"];
	//annulation de l'action des boutons
	for(var button in tabButtons){
		document.getElementById(tabButtons[button]).onclick="";
	}
}

function stopTimer(){
	"use strict"
	if(timer!=null){
		clearInterval(timer);
		timer=null;
		flagMinutes = false;
		flagHours = false;
		var tabButtons = ["idScndsUpButton","idScndsDownButton","idMntsUpButton","idMntsDownButton","idHrsUpButton","idHrsDownButton"];
		for(var button in tabButtons){
			document.getElementById(tabButtons[button]).onclick=getElement;
		}
	}
}

function resetTimer(){
	"use strict"
	stopTimer();
	var champs = ["Hrs","Mnts","Scnds"];
	for(var id in champs){
		for(var i=1 ; i<=2 ; i++){
			document.getElementById("id"+champs[id]+"Nmbr"+i).src="images/0.png" ;
		}
	}
}


function getElement(){
//Recupere l'id de l'element actif : bouton clique
//pour appeler la fonction en fournissant des parametres
	"use strict"
	var idElement = document.activeElement.id;
	switch(idElement) {
		case "idScndsUpButton" :
			setTimerUp("idScndsNmbr2",9,true,"idScndsNmbr1",5);
			break;
		case "idMntsUpButton" :
			setTimerUp("idMntsNmbr2",9,true,"idMntsNmbr1",5);
			break;
		case "idHrsUpButton" :
			setTimerUp("idHrsNmbr2",9,true,"idHrsNmbr1",2);
			break;
		case "idScndsDownButton" :
			setTimerDown("idScndsNmbr2",true,"idScndsNmbr1");
			break;
		case "idMntsDownButton" :
			setTimerDown("idMntsNmbr2",true,"idMntsNmbr1");
			break;
		case "idHrsDownButton" :
			setTimerDown("idHrsNmbr2",true,"idHrsNmbr1");
			break;
	}
}

window.onload=function(){
//Utiliser onclick ne permet pas de passer des arguments
//Appel de la fonction getElement()
	document.getElementById("idScndsUpButton").onclick=getElement;
	document.getElementById("idScndsDownButton").onclick=getElement;
	document.getElementById("idMntsUpButton").onclick=getElement;
	document.getElementById("idMntsDownButton").onclick=getElement;
	document.getElementById("idHrsUpButton").onclick=getElement;
	document.getElementById("idHrsDownButton").onclick=getElement;
	document.getElementById("idStartButton").onclick=startTimer;
	document.getElementById("idStopButton").onclick=stopTimer;
	document.getElementById("idResetButton").onclick=resetTimer;
}