const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

var published_key = 'pk_test_51P6lo4SEFvfOooOeJi3mYnN9u3dzFDQd2z3GPdYL88akwHTQ2WqUSf0wlpVpjJJzH5nawju6mImn9zl7Y47XeEqn00B2b8Uaa8';
var secret_key = 'sk_test_51P6lo4SEFvfOooOepgKDluy0p7Atg4x0NUJmL2Ks3ughCYwYG60f5fNF1vTwPQojEkizprYk5XbtY85KRgK6GdfH00UhcnCqYI';

const stripe = require('stripe')(secret_key);

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render('Home', {
        key: published_key
    })
});

app.post('/payment', function(req,res){
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Abhi',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    }).then((customer) => {
        return stripe.paymentIntents.create({
            amount: 5000,     
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.send("successs")
    }).
    catch((err) =>{
        res.send(err)
    });
})

app.listen(port, function(error){
    if(error) throw error
    console.log("Server created Successfully")
})