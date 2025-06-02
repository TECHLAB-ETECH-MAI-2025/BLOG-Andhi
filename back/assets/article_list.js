import $ from "jquery";
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';

$(document).ready(function () {
	const articleTable = $("#articles-table").DataTable({
        searching: true,
		processing: true,
		serverSide: true,
		responsive: true,
		ajax: {
			url: "/api/articles",
			type: "POST",
		},
		columns: [
			{ data: "id" },
			{ data: "title" },
			{ data: "user" },
			{ data: "categories" },
			{ data: "likesCount" },
			{ data: "commentsCount" },
			{ data: "createdAt" },
			{ data: "actions", orderable: false, searchable: false },
		],
		// language: {
		// 	url: ""
		// }
		order: [[0, "desc"]],
	});

	const $searchInput = $("#search-article");
	const $searchResults = $("#search-results");
	let searchTimeout;

	$searchInput.on("input", function () {
		const query = $(this).val().trim();

		clearTimeout(searchTimeout);

		if (query.length < 2) {
			$searchResults.removeClass("show").html("");
			return;
		}

		searchTimeout = setTimeout(() => {
			$.ajax({
				url: "/api/articles/search",
				method: "GET",
				data: { q: query },
				dataType: "json",
				success: function (response) {
					if (response.results && response.results.length > 0) {
						let html = "";

						response.results.forEach((article) => {
							html += `
									${article.title}
									${article.categories.join(", ")}
								`;
						});

						$searchResults.html(html).addClass("show");
					} else {
						$searchResults.html("Aucun résultat trouvé").addClass("show");
					}
				},
			});
		}, 300);
	});

	$(document).on("click", ".search-item", function () {
		const articleId = $(this).data("id");
		if (articleId) {
			window.location.href = `/article/${articleId}`;
		}
	});

	$(document).on("click", function (e) {
		if (!$(e.target).closest(".search-container").length) {
			$searchResults.removeClass("show");
		}
	});
});
