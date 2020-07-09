
//index for post fetching
var start_index = 0;
var currentPosts = [];
var currentUser;
var selectedPost;
var isFetching = false;

$('#registerBtn').on('click', (event) => {
    document.getElementById('loading').style.display = 'inline-block';
    const formdata = GetFormDataForRegister();
    if (validateFormForRegister(formdata)) {
        route.get('/register-user', formdata)
            .done(function (response) {
                if (response.message == 'added successfully') {
                    UploadProfilePic();
                    document.getElementById('register-success').style.display = 'block';
                }
                if (response.message == 'email exists') {
                    document.getElementById('register-failed').style.display = 'block';
                }
            });
    } else {
        document.getElementById('register-form-invalid').style.display = 'block';
    }
    document.getElementById('loading').style.display = 'none';
});

$('#signinBtn').on('click', (event) => {
    document.getElementById('loading').style.display = 'inline-block';
    const formdata = GetFormDataForLogin();
    if (validateFormForLogin(formdata)) {
        route.get('/login', formdata)
            .done(function (response) {
                if (response.message == 'email not exists') {
                    document.getElementById('login-failed').style.display = 'block';
                }
                if (response.message == 'login success') {
                    SetSessionStorage(response.user);
                    window.location.assign('/home');
                }

            });
    } else {
        document.getElementById('login-form-invalid').style.display = 'block';
    }
    document.getElementById('loading').style.display = 'none';
});
function validateFormForRegister(formdata) {
    if (formdata.email && formdata.username && formdata.password && formdata.confirm_password && (formdata.password == formdata.confirm_password) && formdata.phone_no && formdata.address && formdata.dob && formdata.profile_pic_name) {
        return true;
    } else {
        return false;
    }
}
function GetSessionStorage() {
    if (sessionStorage.getItem('email')) {
        return {
            email: sessionStorage.getItem('email'),
            username: sessionStorage.getItem('username'),
            password: sessionStorage.getItem('password'),
            profile_pic: sessionStorage.getItem('profile_pic'),
            dob: sessionStorage.getItem('dob'),
            phone_no: sessionStorage.getItem('phone_no'),
            address: sessionStorage.getItem('address'),
            user_id: sessionStorage.getItem('user_id'),
        };
    } else return;
}
function SetSessionStorage(user) {
    sessionStorage.setItem('email', user.email);
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('password', user.password);
    sessionStorage.setItem('profile_pic', user.profile_pic);
    sessionStorage.setItem('dob', user.dob);
    sessionStorage.setItem('phone_no', user.phone_no);
    sessionStorage.setItem('address', user.address);
    sessionStorage.setItem('user_id', user.user_id);
}
function OnHomePageLoad() {
    if (validateUser()) {
        fetchPosts();
        SetProfileDetails();
    } else {
        window.location.assign('/');
    }
    document.getElementById('post-panel').addEventListener('scroll', (e) => {
        if (!isFetching && e.target.scrollHeight - (e.target.scrollTop + e.target.getBoundingClientRect().height) < 750) {
            isFetching = true;
            fetchPosts();
        }
    });
}
function SetProfileDetails() {
    var $UserDetail;
    if (currentUser.profile_pic) {
        $UserDetail = '<img src="' + currentUser.profile_pic + '">';
    } else {
        $UserDetail = '<img src="./assets/user.svg">';
    }
    $('#profile-pic-holder').append($UserDetail);
    let dob = new Date(currentUser.dob);

    var $ProfileDetails = '<p class="username">' + currentUser.username + '</p>' +
                        '<p class="email">' + currentUser.email + '</p>' +
                        '<p class="dob"><img src="./assets/calendar.svg">' + dob.toLocaleDateString() + '</p>' +
                        '<p class="ph-no"><img src="./assets/phone-no.svg">' + currentUser.phone_no + '</p>';
    $('#profile-details').append($ProfileDetails);
}
function fetchPosts() {
    document.getElementById('fetching').style.display = 'block';
    start_index = currentPosts.length;
    route.get('/getposts', { start_index: start_index }).done(function (response) {

        document.getElementById('fetching').style.display = 'none';
        if (response.posts && response.posts.length) {
            let sortedPosts = response.posts.sort((a, b) => parseInt(b.post_id) - parseInt(a.post_id));
            AddPostsToDOM(sortedPosts);
            sortedPosts.forEach(post => {
                currentPosts.push(post);
            });
            isFetching = false;
        }
    });
}

function validateUser() {
    currentUser = GetSessionStorage();
    return currentUser != undefined && currentUser.email != undefined;
}
function GetFormDataForRegister() {
    const formData = {
        email: $('input[name=user_email]').val(),
        username: $('input[name=username]').val(),
        password: $('input[name=user_password]').val(),
        confirm_password: $('input[name=user_confirm_password]').val(),
        dob: $('input[name=user_dob]').val(),
        phone_no: $('input[name=user_phone_no]').val(),
        address: $('input[name=user_address]').val(),
        profile_pic_name: document.getElementById("profile-pic").files[0] ? document.getElementById("profile-pic").files[0].name : undefined,
    };

    return formData;
}

//for login
function validateFormForLogin(formdata) {
    if (formdata.email && formdata.password) {
        return true;
    } else {
        return false;
    }
}
function GetFormDataForLogin() {
    const formData = {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
    };

    return formData;
}

//image uploader
function UploadProfilePic() {
    var fd = new FormData();
    var image = document.getElementById("profile-pic").files[0];
    fd.append('image', image);
    route.post('/upload/profile', fd).done(function (response) { }).fail(function () { });
}

//image uploader
function UploadCommentPic() {
    var fd = new FormData();
    var image = document.getElementById("comment-file").files[0];
    if (image) {
        fd.append('image', image);
        route.post('/upload/comment', fd).done(function (response) { }).fail(function () { });
    }
}

//image uploader
function UploadPostPic() {
    var fd = new FormData();
    var image = document.getElementById("post-file").files[0];
    if (image) {
        fd.append('image', image);
        route.post('/upload/post', fd).done(function (response) { }).fail(function () { });
    }
}

function AddPostsToDOM(posts) {
    posts.forEach(post => {
        let date = new Date(post.posted_on);
        let formatted_date = date.toDateString();
        var $cardElement = '<div id="card-' + post.post_id + '" class="card">';
        if (post.image) {
            $cardElement += '<img class="card-img-top" src="' + post.image + '" alt="post image">';
        }
        $cardElement += '';
        if (post.desc) {
            $cardElement += '<div class="card-body"><p class="card-text">' + post.desc + '</p></div>'
        }
        $cardElement += '<div class="card-body"><a title="Like" id="like-' + post.post_id + '" class="card-link"><div class="counts" id="like-count-' + post.post_id + '">' + post.likes + '</div><i class="fas fa-thumbs-up"></i></a>' +
            '<a title="Comment" id="comment-' + post.post_id + '" class="card-link"><div class="counts" id="comment-count-' + post.post_id + '">' + post.comments_count + '</div><i class="fas fa-comments"></i></a>' +
            '<div class="posted-on">' + 'Posted on <span class="date">' + formatted_date + '</span></div></div></div>';
        $('#posts').append($cardElement);
    });
}
//card link corresponds to like or comment button
$('body').on('click', '.card-link', (event) => {
    let id = event.currentTarget.id;
    let splits = id.split('-');
    if (splits[0] == 'like') {
        OnLikeClicked(splits[1]);
    } else if (splits[0] == 'comment') {
        OnCommentClicked(splits[1]);
    }
});

function OnLikeClicked(id) {
    var inputdata = {
        post_id: id,
        user_id: currentUser.user_id,
    }
    route.get('/post/like', inputdata)
        .done(function (response) {
            if (response) {
                var currentLikes = parseInt(document.getElementById('like-count-' + id).innerHTML);
                if (response.process == 'liked') {
                    document.getElementById('like-count-' + id).innerHTML = currentLikes + 1;
                } else if (response.process == 'disliked') {
                    document.getElementById('like-count-' + id).innerHTML = currentLikes - 1;
                }
            }
        });
}
function GetSelectedComment(id) {
    //var selectedPost;
    for (let post of currentPosts) {
        if (post.post_id == id) {
            return post;
        }
    }

}
function OnCommentClicked(id) {
    selectedPost = GetSelectedComment(id);
    var $CommentContent = '<div class="card">';
    if (selectedPost.image) {
        if (selectedPost.desc) {
            $CommentContent += '<img class="card-img-top" src="' + selectedPost.image + '" alt="Card image cap">' +
                '<div class="card-body"><p class="card-text">' + selectedPost.desc + '</p></div>' +
                '<ul class="list-group list-group-flush">';
        } else {
            $CommentContent += '<img class="card-img-top" src="' + selectedPost.image + '" alt="Card image cap">' +
                '<ul class="list-group list-group-flush">';
        }
    } else {
        if (selectedPost.desc) {
            $CommentContent += '<div class="card-body"><p class="card-text">' + selectedPost.desc + '</p></div>' +
                '<ul class="list-group list-group-flush">';
        } else {
            $CommentContent += '<ul class="list-group list-group-flush">';
        }
    }

    selectedPost.comments.forEach(comment => {
        $CommentContent += '<li class="list-group-item card">';

        if (comment.comment_pic) {
            $CommentContent += '<img class="card-img-top" src="' + comment.comment_pic + '" alt="post image">';
        }
        if (comment.user_pic) {
            if (comment.content) {
                $CommentContent += '<div class="comment-text"><div class="comment-picture"><img src="' + comment.user_pic + '"></div><div class="content"><i><div class="heading">commented by ' + comment.username + '</div></i><div>' + comment.content + '</div></div></div></li>';
            } else {
                $CommentContent += '<div class="comment-text"><div class="comment-picture"><img src="' + comment.user_pic + '"></div><div class="content"><i><div class="heading">commented by ' + comment.username + '</div></i></div></div></li>';
            }

        } else {
            if (comment.content) {
                $CommentContent += '<div class="comment-text"><div class="comment-picture"><img src="./assets/user.svg"></div><div class="content"><i><div class="heading">commented by ' + comment.username + '</div></i><div>' + comment.content + '</div></div></div></li>';
            } else {
                $CommentContent += '<div class="comment-text"><div class="comment-picture"><img src="./assets/user.svg"></div><div class="content"><i><div class="heading">commented by ' + comment.username + '</div></i></div></div></li>';
            }
        }
    });
    $CommentContent += '</ul><div class="card-body comment-tab"><p class="card-text">Comment</p><div class="input-group"><div class="input-group-prepend"><div class="custom-file">' +
        '<input type="file" id="comment-file" class="custom-file-input"><label class="custom-file-label" for="inputGroupFile03"><img src="./assets/file-upload.svg"></label>' +
        '</div></div><textarea id="comment-textarea" class="form-control" placeholder="Type a comment....."></textarea></div><button title="Comment" id="commentBtn" type="button" class="btn btn-light"><img src="./assets/comment.svg"></button></div></div>';
    $('#comment-panel').html($CommentContent);
}
function GetCommentDetails() {
    let comment = $('#comment-textarea').val();
    let pic_name = document.getElementById("comment-file").files[0] ? document.getElementById("comment-file").files[0].name : undefined;
    if (comment || pic_name) {
        return {
            post_id: selectedPost.post_id,
            user_id: currentUser.user_id,
            comment: comment,
            pic_name: pic_name,
            username: currentUser.username,
            user_pic: currentUser.profile_pic,
        };
    } else {
        return null;
    }
}

function UpdateComments(commentDetails) {
    currentPosts.forEach(post => {
        if (commentDetails.post_id == post.post_id) {
            post.comments.push({
                user_id: commentDetails.user_id,
                comment_pic: commentDetails.pic_name != undefined ? 'http://localhost:3000/uploads/comments/' + commentDetails.pic_name : null,
                content: commentDetails.comment,
                post_id: commentDetails.post_id,
                username: commentDetails.username,
                user_pic: commentDetails.user_pic,
            });
        }
    });
}

function GetPostDetails() {
    let post_desc = $('#post-textarea').val();
    let pic_name = document.getElementById("post-file").files[0] ? document.getElementById("post-file").files[0].name : undefined;
    if (post_desc || pic_name) {
        return {
            post_desc: post_desc,
            pic_name: pic_name,
        };
    } else {
        return null;
    }
}

function ClearPostField() {
    document.getElementById('post-textarea').value = '';
    document.getElementById("post-file").value = '';
}

$('#comment-panel').on('click', '#commentBtn', (event) => {
    var commentDetails = GetCommentDetails();
    if (commentDetails) {
        if (commentDetails.pic_name) {
            UploadCommentPic();
        }
        route.get('/post/comment', commentDetails).done(res => {
            $('#comment-panel').html('');
            UpdateComments(commentDetails);
            OnCommentClicked(commentDetails.post_id);
        });
    }
});

$('#post-panel').on('click', '#postBtn', (event) => {
    var postDetails = GetPostDetails();
    if (postDetails) {
        if (postDetails.pic_name) {
            UploadPostPic();
        }
        route.get('/post/create', postDetails).done(res => {
            currentPosts = [];
            document.getElementById('posts').innerHTML = '';
            fetchPosts();
            ClearPostField();
        });
    }
});


// routes
const route = {
    get: function (url, data) {
        return $.ajax({
            type: 'GET',
            url: url,
            data: data,
            async: false,
            dataType: 'json'
        });
    },
    post: function (url, data) {
        return $.ajax({
            type: 'POST',
            url: url,
            data: data,
            async: false,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
        });
    }
};