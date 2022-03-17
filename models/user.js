const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// mongoose est la passerelle entre mongoDB et NodeJs (entre la base de données et l'api)

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sauce: { type: mongoose.Types.ObjectId, ref: 'Sauce'}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

// on créé un schema de données user, on vérifie l'unicité des données et on exporte le schema sous forme de modèle mongoose