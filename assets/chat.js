import $ from "jquery";

$(document).ready(function() {
    function loadMessages() {
        $.ajax({
            url: '/api/chat/' + $('#receiver-id').val(),
            type: 'GET',
            success: function(response) {
                if (!response.success) {
                    console.error('Erreur lors du chargement des messages : ' + response.error);
                } else {
                    const messageList = $('#message-list');
                    messageList.empty();
                    const senderId = $('#sender-id').val();

                    response.messages.forEach(message => {
                        const loadMessage = $('#load-message');

                        // loadMessage.hide();

                        let messageItem = `
                        <div class="d-flex align-items-end gap-1 ${ message.sender.id == senderId ? "align-self-end" : "align-self-start flex-row-reverse"} message-item">
                            <i id="message-date">
                                ${message.createdAt}
                            </i>
                            <div class="d-flex flex-column">
                                <span id="message-value" class="rounded-4 px-3 py-1 ${message.sender.id == senderId ? "bg-primary text-light align-self-end" : "bg-light text-dark align-self-start" }">
                                    ${message.content}
                                </span>
                            </div>
                        </div>
                        `;
                        messageList.append(messageItem);
                    });
                }
            },
            error: function() {
                console.error('Erreur lors du chargement des messages');
            }
        });
    }

    loadMessages();

    setInterval(loadMessages, 2000);
    
    $('#send-message').click(function(e) {
        e.preventDefault();
        
        var content = $('#message-content').val();
        if (!content.trim()) return;

        $.ajax({
            url: '/api/chat/send',
            type: 'POST',
            data: {
                content,
                receiver: $('#receiver-id').val()
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#message-content').val('');
                    $('#message-list').append(response.messageHtml);
                    $(document).scrollTop($(document).height());
                }
                // Forcer le rafraîchissement des messages
                loadMessages();
            },
            error: function() {
                alert('Erreur lors de l\'envoi du message');
            }
        });
    });
});