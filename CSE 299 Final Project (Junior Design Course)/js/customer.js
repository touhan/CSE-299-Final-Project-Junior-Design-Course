document.addEventListener("DOMContentLoaded", function () {
    const customerLoginForm = document.getElementById("customer-login-form");

    if (customerLoginForm) {
        customerLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = event.target.querySelector('input[type="email"]').value;
            const password = event.target.querySelector('input[type="password"]').value;

            if (email && password) {
                localStorage.setItem('customerLoggedIn', 'true');
                localStorage.setItem('currentUser', email);
                window.location.href = "customer_feedback.html";
            } else {
                alert("Please enter valid login credentials.");
            }
        });
    }

    if (window.location.pathname.includes("customer_feedback.html")) {
        if (!localStorage.getItem('customerLoggedIn')) {
            window.location.href = "index.html";
        }

        const yourReviewsTab = document.getElementById("your-reviews-tab");
        const publicReviewsTab = document.getElementById("public-reviews-tab");
        const yourReviewsSection = document.getElementById("your-reviews-section");
        const publicReviewsSection = document.getElementById("public-reviews-section");
        const logoutBtn = document.getElementById("logout-btn");

        yourReviewsTab.addEventListener("click", function() {
            yourReviewsSection.style.display = "block";
            publicReviewsSection.style.display = "none";
            loadFeedback();
        });

        publicReviewsTab.addEventListener("click", function() {
            yourReviewsSection.style.display = "none";
            publicReviewsSection.style.display = "block";
            loadPublicFeedback();
        });

        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem('customerLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = "index.html";
        });

        const feedbackForm = document.getElementById("verified-feedback-form");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackMessage = document.getElementById("feedback-message");
        const feedbackList = document.getElementById("feedback-list");
        const publicFeedbackList = document.getElementById("public-feedback-list");

        function loadFeedback() {
            const currentUser = localStorage.getItem('currentUser');
            const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || {};
            const userFeedbacks = feedbacks[currentUser] || [];

            feedbackList.innerHTML = "";
            userFeedbacks.forEach((feedback, index) => {
                const feedbackItem = document.createElement("div");
                feedbackItem.className = "feedback-item mt-2 p-2 border";
                feedbackItem.innerHTML = `
                    <p>${feedback.text}</p>
                    ${feedback.image ? `<img src="${feedback.image}" class="img-fluid mt-2" alt="Feedback Image" style="max-width: 100px; max-height: 100px;">` : ""}
                    <small class="text-muted">Submitted on: ${feedback.date}</small>
                    <div class="mt-2">
                        <button onclick="editFeedback(${index})" class="btn btn-sm btn-warning">Edit</button>
                        <button onclick="deleteFeedback(${index})" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                `;
                feedbackList.appendChild(feedbackItem);
            });
        }

        function loadPublicFeedback() {
            const publicFeedbacks = JSON.parse(localStorage.getItem("publicFeedbacks")) || [];
            publicFeedbackList.innerHTML = "";

            publicFeedbacks.forEach((feedback, index) => {
                const feedbackItem = document.createElement("div");
                feedbackItem.className = "feedback-item mt-2 p-2 border";
                feedbackItem.innerHTML = `
                    <p>${feedback.text}</p>
                    ${feedback.image ? `<img src="${feedback.image}" class="img-fluid mt-2" alt="Feedback Image" style="max-width: 100px; max-height: 100px;">` : ""}
                    <small class="text-muted">By: ${feedback.user} on ${feedback.date}</small>
                    <div class="mt-2">
                        <h6>Comments:</h6>
                        <div id="public-feedback-comments-${index}"></div>
                        <form id="public-feedback-comment-form-${index}">
                            <input type="text" id="public-feedback-comment-${index}" class="form-control" placeholder="Write a comment...">
                            <input type="file" id="public-feedback-comment-image-${index}" class="form-control mt-2">
                            <button type="submit" class="btn btn-sm btn-primary mt-2">Post Comment</button>
                        </form>
                    </div>
                `;
                publicFeedbackList.appendChild(feedbackItem);

                const comments = feedback.comments || [];
                const commentList = document.getElementById(`public-feedback-comments-${index}`);
                commentList.innerHTML = "";

                comments.forEach((comment) => {
                    const commentItem = document.createElement("div");
                    commentItem.className = "comment-item mt-2 p-2 border";
                    commentItem.innerHTML = `
                        <p>${comment.text}</p>
                        ${comment.image ? `<img src="${comment.image}" class="img-fluid mt-2" alt="Comment Image" style="max-width: 100px; max-height: 100px;">` : ""}
                        <small class="text-muted">Commented by: ${comment.user} on ${comment.date}</small>
                    `;
                    commentList.appendChild(commentItem);
                });

                const commentForm = document.getElementById(`public-feedback-comment-form-${index}`);
                commentForm.addEventListener("submit", function(event) {
                    event.preventDefault();
                    const commentText = document.getElementById(`public-feedback-comment-${index}`).value.trim();
                    const commentImageFile = document.getElementById(`public-feedback-comment-image-${index}`).files[0];
                    const currentUser = localStorage.getItem('currentUser');
                    const reader = new FileReader();

                    if (commentText || commentImageFile) {
                        const newComment = {
                            text: commentText,
                            date: new Date().toLocaleString(),
                            user: currentUser
                        };

                        if (commentImageFile) {
                            reader.onload = function(e) {
                                newComment.image = e.target.result;
                                saveComment(index, newComment);
                            };
                            reader.readAsDataURL(commentImageFile);
                        } else {
                            saveComment(index, newComment);
                        }
                    }
                });
            });
        }

        function saveComment(feedbackIndex, comment) {
            const publicFeedbacks = JSON.parse(localStorage.getItem("publicFeedbacks")) || [];
            publicFeedbacks[feedbackIndex].comments = publicFeedbacks[feedbackIndex].comments || [];
            publicFeedbacks[feedbackIndex].comments.push(comment);
            localStorage.setItem("publicFeedbacks", JSON.stringify(publicFeedbacks));
            loadPublicFeedback();
        }

        feedbackForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const feedback = feedbackText.value.trim();
            const feedbackImageFile = document.getElementById("feedback-image").files[0];
            const reader = new FileReader();

            if (feedback || feedbackImageFile) {
                const newFeedback = {
                    text: feedback,
                    date: new Date().toLocaleString(),
                    user: localStorage.getItem('currentUser'),
                    comments: []
                };

                if (feedbackImageFile) {
                    reader.onload = function(e) {
                        newFeedback.image = e.target.result;
                        saveFeedback(newFeedback);
                    };
                    reader.readAsDataURL(feedbackImageFile);
                } else {
                    saveFeedback(newFeedback);
                }

                feedbackMessage.innerHTML = "<div class='alert alert-success'>Feedback submitted successfully!</div>";
                feedbackForm.reset();
            } else {
                feedbackMessage.innerHTML = "<div class='alert alert-danger'>Please write your feedback.</div>";
            }
        });

        function saveFeedback(feedback) {
            const currentUser = localStorage.getItem('currentUser');
            const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks")) || {};
            const publicFeedbacks = JSON.parse(localStorage.getItem("publicFeedbacks")) || [];

            if (!feedbacks[currentUser]) {
                feedbacks[currentUser] = [];
            }

            feedbacks[currentUser].push(feedback);
            localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));

            publicFeedbacks.push(feedback);
            localStorage.setItem("publicFeedbacks", JSON.stringify(publicFeedbacks));

            loadFeedback();
            loadPublicFeedback();
        }

        window.editFeedback = function (index) {
            const currentUser = localStorage.getItem('currentUser');
            const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks"));
            const userFeedbacks = feedbacks[currentUser];

            const newText = prompt("Edit your feedback:", userFeedbacks[index].text);
            if (newText) {
                userFeedbacks[index].text = newText;
                feedbacks[currentUser] = userFeedbacks;
                localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));
                loadFeedback();
                loadPublicFeedback();
            }
        };

        window.deleteFeedback = function (index) {
            const currentUser = localStorage.getItem('currentUser');
            const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks"));
            const publicFeedbacks = JSON.parse(localStorage.getItem("publicFeedbacks"));

            feedbacks[currentUser].splice(index, 1);
            publicFeedbacks.splice(index, 1);

            localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));
            localStorage.setItem("publicFeedbacks", JSON.stringify(publicFeedbacks));

            loadFeedback();
            loadPublicFeedback();
        };

        loadFeedback();
        loadPublicFeedback();
        // image 
        document.getElementById("feedback-image").addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Display image in an img element
                    const imagePreview = document.createElement("img");
                    imagePreview.src = e.target.result;
                    imagePreview.classList.add("uploaded-image-preview"); // Optional: add a class for styling
                    document.getElementById("feedback-list").appendChild(imagePreview);
                };
                reader.readAsDataURL(file); // Convert file to data URL
            }
        });
        
    }
});
