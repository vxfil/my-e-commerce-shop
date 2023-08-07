import React, {useEffect} from 'react';

// eslint-disable-next-line no-unused-vars
const LiqpayWidjet = ({data, signature, language}) => {

  useEffect(() => {
    window.LiqPayCheckoutCallback = function() {
      window.LiqPayCheckout.init({
        data,
        signature,
        embedTo: '#liqpay_checkout',
        language,
        mode: 'embed'
      }).on('liqpay.callback', function(data){
        console.log(data.status);
        console.log(data);
      }).on('liqpay.ready', function(data){
        console.log('ready', data);
      }).on('liqpay.close', function(data){
        console.log('close', data);
      });
    }();
  }, [window.LiqPayCheckoutCallback, window.LiqPayCheckout.init]);

  return (
    <div id="liqpay_checkout"></div>
  );
};

export default LiqpayWidjet;