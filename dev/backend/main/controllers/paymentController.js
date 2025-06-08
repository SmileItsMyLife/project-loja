const bodyParser = require('body-parser');
const stripe = require('stripe')('sua_chave_secreta_stripe');

class PaymentController {
   async pay (req, res, next){
    const { amount } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
   }

}

module.exports = new PaymentController();