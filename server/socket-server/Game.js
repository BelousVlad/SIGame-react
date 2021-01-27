'use strict';

const fs = require('fs'),
	  parseStringToXML = require('xml2js').parseString

class Question{
	constructor( theme, index ){
		this.theme = theme;
		this.index = index;
	}
}

class Game{
	constructor(lobby){
		this.lobby = lobby;
		this.filePath = lobby.filePath;
		this.rules = lobby.rules;
		var defaultRules = {
			answerTimeAwait : 2e3 /* 2sec */,
			//
		}
		for ( let i in defaultRules )
			this.rules[i] = typeof this.rules[i] === 'undefined' ? defaultRules[i] : this.rules[i];

		parseStringToXML(fs.readFileSync( this.filePath ), function( err, json ) {
			this.package = json.package;
			this.rounds = this.package.rounds;
		}.bind(this));

		this.current = {
			round : this.rounds[0],
			question : undefined
		}
	}

	checkQuestion( question, client ) {
		question = this.getQuestion( question );
		if ( !question )
			return;
		this.current.question = question;
		question.checked = true;
		let waitingForClients = Object.keys( this.lobby.clients ) . length;

		function clientReady() {
			waitingForClients--;
			if ( waitingForClients <= 0 )
				this.displayQuestion();
		}
		clientReady = clientReady.bind(this);

		for ( let i in this.lobby.clients ) {
			this.lobby.clients[i].once( 'question_received', clientReady );
			this.lobby.clients[i].once( 'client_leave', clientReady );
		}

		setTimeout( this.rules.answerTimeAwait /* 5sec */, function() {
			if ( waitingForClients ) {
				this.displayQuestion();
				// 'cant run coz players havnt files';
			}
		} )
	}

	selectRound( roundIndex ) {
		this.current.round = roundIndex;
		this.update();
	}

	reloadCurrentRound() {
		this.current.round.themes.forEach( item => {
			item.questions.forEach( item_ => {
				item_.checked = false;
			} )
		})
	}

	hasQuestion( question ) {
		return !!this.getQuestion( question );
	}

	getQuestion( question ){
		let theme = this.current.round.themes.find( item => {
			return item.$.name === question.theme;
		} )
		return theme.questions[ question.index ];
	}

	update() {
		// update users view
	}

	displayQuestion() {
		console.log( this.current.question );
	}
}

module.exports = Game;