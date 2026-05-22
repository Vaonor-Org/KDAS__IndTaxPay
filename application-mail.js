(function() {
  var MAIL_ENDPOINT = window.INDIA_EFILING_MAIL_ENDPOINT || '/api/send-application-email';

  window.sendApplicationAcknowledgementEmail = async function(ticketData, options) {
    options = options || {};
    var websiteUrl = options.websiteUrl || window.location.origin;
    var trackUrl = websiteUrl.replace(/\/$/, '') + '/ui/track.html';

    var response = await fetch(MAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: ticketData.name,
        email: ticketData.email,
        serviceType: ticketData.serviceType,
        ticketNumber: ticketData.ticketNumber,
        trackUrl: trackUrl
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  };
})();
