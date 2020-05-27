var createError = require('http-errors');
var express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const request=require('request');
var bodyParser=require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var paypal = require('paypal-rest-sdk');
require('dotenv').config();
var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const stripe = require('stripe')('sk_test_gOkdvWN7FyPKA9tnzpDdF8Er00Sbqvspay');

userController = require('./controllers/userController');

// Configure passport

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
var users = {};

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done (null, user.profile.oid);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

// <ConfigureOAuth2Snippet>
// Configure simple-oauth2
const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
  }
});
// </ConfigureOAuth2Snippet>

// Callback function called once the sign-in is complete
// and an access token has been obtained
// <SignInCompleteSnippet>
async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."));
  }

  try{
    const user = await graph.getUserDetails(accessToken);

    if (user) {
      // Add properties to profile
      profile['email'] = user.mail ? user.mail : user.userPrincipalName;
    }
  } catch (err) {
    return done(err);
  }

  // Create a simple-oauth2 token from raw tokens
  let oauthToken = oauth2.accessToken.create(params);

  // Save the profile and tokens in user storage
  users[profile.oid] = { profile, oauthToken };
  return done(null, users[profile.oid]);
}
// </SignInCompleteSnippet>

// Configure OIDC strategy
passport.use(new OIDCStrategy(
  {
    identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  signInComplete
));

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var books=require('./routes/books');
var graph = require('./graph');
var adviser=require('./routes/adviser');
var checkout=require('./routes/checkout');
var blog=require('./routes/blog');
var publish=require('./routes/publish');
var publications=require('./routes/publications');
var blogpost=require('./routes/blogpost');
var app = express();

// <SessionSnippet>
// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(session({
  secret: 'your_secret_value_here',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}));

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function(req, res, next) {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash('error_msg');

  // Check for simple error string and
  // convert to layout's expected format
  var errs = req.flash('error');
  for (var i in errs){
    res.locals.error.push({message: 'An error occurred', debug: errs[i]});
  }

  next();
});
// </SessionSnippet>

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// <FormatDateSnippet>
var hbs = require('hbs');
var moment = require('moment');
// Helper to format date/time sent by Graph
hbs.registerHelper('eventDateTime', function(dateTime){
  return moment(dateTime).format('M/D/YY h:mm A');
});
// </FormatDateSnippet>

hbs.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
/* db.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connection has been established succesfully");
  }
}); */
// <AddProfileSnippet>
app.use(function(req, res, next) {
  // Set the authenticated user in the
  // template locals
  if (req.user) {
    const name = req.user.profile.displayName;
    const success = () => {
      userController.getId(name, (err, id) => {
        if (err)
        {
          return next(createError(500, err.message));
        }

        req.user.profile.id = id;
        res.locals.user = req.user.profile;
        next();
      })
    }
    
    userController.exists(name, success, () => {
      userController.register(req.user.profile.displayName);
      success();
    })
  }
  else
  {
    next();
  }
});
// </AddProfileSnippet>

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use('/books', books);
app.use('/book',books);
app.use('/reccomender',adviser);
app.use('/checkout',checkout);
app.use('/blog',blog);
app.use('/blog/add-new-post',blog);
app.use('/publisher',publish);
app.use('/publications',publications);
app.use('/blogpost',blogpost);


paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'AXO6WVoJMcA0a5Tb1tAEnRGHm3oNxazNrTKN7dAWU1v8Fjr8ZRUYFfhkwlnQPAfFUD5fwEToAxp44JMi', // please provide your client id here 
  'client_secret': 'ECGBm-Z3t4XTr2w5YpwZUYfGv8uZj14_rspAOF1iRVXpTsOAIp6RsKpFtajste9XUPjHGAqprn6c8WXG' // provide your client secret here 
});
app.get('/buy' , ( req , res ) => {
	// create payment object 
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		"return_url": "https://core-b00k.azurewebsites.net/success",
		"cancel_url": "https://core-b00k.azurewebsites.net/err"
	},
	"transactions": [{
		"amount": {
			"total": 10.00,
			"currency": "USD"
		},
		"description": " premium account "
	}]
    }
	
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            var id = transaction.id; 
            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    return res.redirect( links[counter].href )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.render('err.hbs');
        });
}); 


// success page 
app.get('/success' , (req ,res ) => {
  if(req.user){
    if(req.query.token){
      //ADAUGA USER CA A PLATIT 
      console.log(req.query.token)
      req.user.profile.premium=1;
      }
  }
   
    res.render('success.hbs'); 
})

// error page 
app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.render('err.hbs'); 
})

// helper functions 
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}			
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
