$(document).ready(function() {
    //link for the file
    fetch('https://raw.githubusercontent.com/dias07/testing/main/links.js')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {

        eval(data);



        var baseUrl = baseUrl; // Variable obtained from the googlefile

        // Add product
        $("#product-form").submit(function (e) {
            e.preventDefault();
            var productName = $("#product-name").val();
            $.ajax({
                url: `${baseUrl}/product`,
                type: 'POST',
                data: JSON.stringify({
                    product_name: productName
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    alert(data.message);
                    loadProducts();
                }
            });
        });

        // Add review
        $("#review-form").submit(function (e) {
            e.preventDefault();
            var productId = $("#product-select").val();
            var reviewContent = $("#review-content").val();
            $.ajax({
                url: `${baseUrl}/product/${productId}/review`,
                type: 'POST',
                data: JSON.stringify({
                    review: reviewContent
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    alert(data.message);
                    loadReviews(productId);
                }
            });
        });

        // Load products into dropdown
        function loadProducts() {
            $.getJSON(`${baseUrl}/product`, function (data) {
                var dropdown = $("#product-select");
                dropdown.empty();
                $.each(data.products, function () {
                    dropdown.append($("<option />").val(this.id).text(this.name));
                });
                dropdown.change();
            });
        }

        // Load reviews when a product is selected
        $("#product-select").change(function () {
            var productId = $(this).val();
            loadReviews(productId);
        });

        function loadReviews(productId) {
            $.getJSON(`${baseUrl}/product/${productId}/review`, function (data) {
                var reviewsDiv = $("#reviews");
                reviewsDiv.empty();
                $.each(data.reviews, function () {
                    var rating = this.rating;
                    var stars = $("<span />");
                    for (var i = 1; i <= 5; i++) {
                        var starIcon = $("<i />").addClass("fas fa-star");
                        if (i <= rating) {
                            starIcon.addClass("filled");
                        } else {
                            starIcon.addClass("empty");
                        }
                        stars.append(starIcon);
                    }
                    var reviewElement = $("<p />").html("<em>" + this.content + "</em>").append(' - AI analyzed rating: ').append(stars);
                    reviewsDiv.append(reviewElement);
                });
            });
        }

        loadProducts();

      })
      .catch(error => {
        console.error('There was a problem fetching the file:', error);
      });
});
