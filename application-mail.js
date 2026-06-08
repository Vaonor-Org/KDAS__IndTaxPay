(function() {
  // Point to the running mail server. On production this should be your
  // deployed mail server URL. Locally it runs on port 8787.
  var MAIL_ENDPOINT = window.INDTAXPAY_MAIL_ENDPOINT
    || 'http://127.0.0.1:8787/send-application-email';

  window.sendApplicationAcknowledgementEmail = async function(ticketData, options) {
    options = options || {};
    // Always use the canonical track URL
    var trackUrl = 'https://indtaxpay.com/track';

    var response = await fetch(MAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:         ticketData.name,
        email:        ticketData.email,
        serviceType:  ticketData.serviceType,
        ticketNumber: ticketData.ticketNumber,
        trackUrl:     trackUrl
      })
    });

    if (!response.ok) {
      var errText = '';
      try { errText = await response.text(); } catch(_) {}
      throw new Error('Mail server error: ' + (errText || response.status));
    }

    return response.json();
  };
})();
