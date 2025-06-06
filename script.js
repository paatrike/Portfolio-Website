const webhookURL = 'https://discord.com/api/webhooks/1380328661735182436/JPZdpr--7qPjvbFK-wYlH2ErG_bcT7HHfbAoXevfcfOALbXbll55TqVWrEMOt1zjffKo';
  const roleIdToMention = '1380328865322238094';

  function showMessage(text, type = 'success') {
    const msgDiv = document.getElementById('formMessage');
    msgDiv.textContent = text;
    msgDiv.className = 'form-message ' + type;  
    msgDiv.style.display = 'block';
    msgDiv.style.opacity = '1';

    // Hide message after 5 seconds
    setTimeout(() => {
      msgDiv.style.opacity = '0';
      setTimeout(() => {
        msgDiv.style.display = 'none';
      }, 300);
    }, 5000);
  }

  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const lastSent = localStorage.getItem('lastMessageSentTime');
    const now = Date.now();

    if (lastSent && now - lastSent < 24 * 60 * 60 * 1000) {
      showMessage('You can only send one message per day. Please try again later.', 'error');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const embed = {
      title: "📬 New Contact Form Submission",
      color: 0x5865F2,
      fields: [
        { name: "👤 Name", value: name, inline: true },
        { name: "📧 Email", value: email, inline: true },
        { name: "📝 Subject", value: subject },
        { name: "💬 Message", value: message }
      ],
      timestamp: new Date().toISOString()
    };

    const payload = {
      content: `<@&${roleIdToMention}> New message received from website!`,
      embeds: [embed],
      allowed_mentions: {
        parse: [],
        roles: [roleIdToMention]
      }
    };

    fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (response.ok) {
          showMessage('Message sent successfully!', 'success');
          this.reset();
          localStorage.setItem('lastMessageSentTime', now.toString());
        } else {
          showMessage('Failed to send message.', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred while sending the message.', 'error');
      });
  });
