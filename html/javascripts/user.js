/**
 * Created by larsstegman on 11/01/15.
 */
var ejs = require('ejs');

function User(id, name, avatar) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;

    this.getId = function() {
        return this.id;
    };

};

exports.findOrCreate = function(profile, callback, db) {
    var temp = "SELECT * FROM User WHERE Email = '<%= (profile.emails?profile.emails[0].value:null) %>' OR Twitter  = <%= profile.id %> OR Steam = <%= profile.id %>";
    var query = ejs.render(temp, {'profile':profile});
    db.query(query, function(err, rows, fields) {
        var userId = 0;
        if(rows.length == 0) {
            console.log("New user login: " + profile.displayName);
            if(profile.provider == 'twitter') {
                var createUserTemp = "INSERT INTO USER(Name, Email, Twitter, Avatar) VALUES('<%= profile.displayName %>', '<%= (profile.emails?profile.emails[0].value:null) %>', <%= profile.id %>, '<%= profile.photos[0].value %>')";
            }
            if(profile.provider == 'steam') {
                var createUserTemp = "INSERT INTO USER(Name, Email, Steam, Avatar) VALUES('<%= profile.displayName %>', '<%= (profile.emails?profile.emails[0].1:null) %>', <%= profile.id %>, '<%= profile.photos[0].value %>')";
            }

            var createUserQuery = ejs.render(createUserTemp, {'profile':profile});
            db.query(createUserQuery, function(err, rows, fields) {
               if(err) {console.log(err);}
               else {
                   userId = rows[0].insertId;
               }
            });

        } else {
            console.log("Known user login: " + profile.displayName);
            userId = rows[0].Id;
        }

        var user = new User(userId, profile.displayName, profile.photos[0].value);
        callback(err, user);
    });
};

exports.deserializeUser = function(userId, db, callback) {
    var queryTemp = "SELECT * FROM User WHERE Id = <%= userId %>";
    var query = ejs.render(queryTemp, {'userId':userId});
    var user;

    db.query(query, function(err, rows, fields) {
        if(err) {console.log(err);}
        else {
            user = new User(rows[0].Id, rows[0].Name, rows[0].Avatar);
            callback(err, user);
        }
    });


};

module.exports.User = User;