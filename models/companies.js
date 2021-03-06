//┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
  //  Database model/schema code for Companies & their respective jobs, details & employees (users)
  //
  //  Notes:
  //
  //  Todo:
  //
//└───────────────────────────────────────────────────────────────────────────────────────────────────┘
var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;

var Company = new Schema({
	name: {type: String, required: true},
	address1: {type: String, required: true},
	address2: {type: String},
	city: {type: String, required: true},
	zip: {type: String, required: true},
	state: {type: String, required: true},
	phone: {type: String}//,
	//We don't really need to keep track of employees or jobs list here....
	//when we can just do a users lookup where company.id = employer company
	//employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	//jobs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Job'}]
}, {timestamps: true});

Company.methods.getInfo = function() 
{ 
	var line2 = "";
	if(address2) line2 = (address2 + "\n");

	return (this.name + '\n' 
			+ this.address1 + '\n' 
			+ line2 
			+ this.city + ', ' + this.state + ' ' + this.zip ); 
};

module.exports = mongoose.model('Company', Company);