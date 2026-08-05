$(function() {

    // Get the form.
    var form = $('#ajax-contact');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Restrict phone input to numbers only
    $('#phone').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Set up an event listener for the contact form.
    $(form).submit(function(e) {
        // Stop the browser from submitting the form.
        e.preventDefault();

        // Validation
        var firstname = $('#firstname').val().trim();
        var lastname = $('#lastname').val().trim();
        var email = $('#email').val().trim();
        var phone = $('#phone').val().trim();
        var message = $('#message').val().trim();

        if (firstname === '' || lastname === '' || email === '' || phone === '' || message === '') {
            $(formMessages).removeClass('success info').addClass('error');
            $(formMessages).text('Please fill in all fields.');
            return;
        }

        if (!/^[0-9]+$/.test(phone)) {
            $(formMessages).removeClass('success info').addClass('error');
            $(formMessages).text('Phone number must contain only numbers.');
            return;
        }

        if (message.length < 100) {
            $(formMessages).removeClass('success info').addClass('error');
            $(formMessages).text('Message must be at least 100 characters long.');
            return;
        }

        // Show loading message
        $(formMessages).removeClass('error success').addClass('info');
        $(formMessages).text('Sending your message...');

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData,
            dataType: 'json'
        })
        .done(function(response) {
            // Make sure that the formMessages div has the 'success' class.
            $(formMessages).removeClass('error info').addClass('success');

            // Set the message text.
            $(formMessages).html('<strong>Success!</strong> Your message has been sent successfully. We will contact you soon.');

            // Clear the form fields including the message field
            $('#firstname, #lastname, #email, #phone, #message').val('');
        })
        .fail(function(data) {
            // Make sure that the formMessages div has the 'error' class.
            $(formMessages).removeClass('success info').addClass('error');

            // Set the message text.
            if (data.responseText !== '') {
                $(formMessages).html('<strong>Error!</strong> ' + data.responseText);
            } else {
                $(formMessages).html('<strong>Oops!</strong> An error occurred and your message could not be sent. Please try again or contact us directly via WhatsApp.');
            }
        });

    });

});