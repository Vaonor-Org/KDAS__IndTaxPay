(function() {
  // Vercel serverless function — same domain, no CORS, no separate server.
  // Works on https://indtaxpay.com/api/send-application-email automatically.
  var MAIL_ENDPOINT = '/api/send-application-email';

  window.sendApplicationAcknowledgementEmail = async function(ticketData, options) {
    var trackUrl = 'https://indtaxpay.com/track';

    var response = await fetch(MAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      throw new Error('Mail API error ' + response.status + ': ' + errText);
    }

    return response.json();
  };
})();
