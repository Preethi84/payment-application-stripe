const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

var published_key = 'your published key here';
var secret_key = 'your secret key here';

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
        return stripe.paymentIntents.create({    //for indian payments
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