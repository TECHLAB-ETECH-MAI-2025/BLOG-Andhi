import $ from "jquery";

$(document).ready(function () {
	const $commentForm = $("#comment-form");
	const $commentsList = $("#comments-list");
	const $commentsCount = $("#comments-count");

	$commentForm.on("submit", function (e) {
		e.preventDefault();

		const $submitBtn = $commentForm.find('button[type="submit"]');
		const originalBtnText = $submitBtn.html();

		$submitBtn.html("Envoi en cours...").prop("disabled", true);

		$.ajax({
			url: $commentForm.attr("action"),
			method: "POST",
			data: $commentForm.serialize(),
			dataType: "json",
			success: function (response) {
				if (response.success) {
					$commentsList.append(response.commentHtml);

					$commentsCount.text(response.commentsCount);

					$commentForm[0].reset();

					let noComment = $('#no-comment');
                    if (noComment) {
						noComment.remove();
					}
				} else {
                    console.error(response.error);
				}
			},
			error: function () {
                console.error("Une erreur est survenue lors de l'envoi du commentaire.");
			},
			complete: function () {
				$submitBtn.html(originalBtnText).prop("disabled", false);
			},
		});
	});

	const $likeButton = $(".like-button");
	const articleId = $likeButton.data("article-id");

	$likeButton.on("click", function () {
		$.ajax({
			url: `/article/${articleId}/like`,
			method: "POST",
			dataType: "json",
			success: function (response) {
				if (response.success) {
					$likeButton.toggleClass("liked", response.liked);
					$("#likes-count").text(response.likesCount);
                    $('#is-liked').text(response.liked ? "Je n'aime plus" : "J'aime");
				}
			},
		});
	});
});
