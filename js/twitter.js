var userJSONPath = "https://raw.githubusercontent.com/MDiazC/socialnetwork-js-project/master/js/users.json";
var postsJSONPath = "https://raw.githubusercontent.com/MDiazC/socialnetwork-js-project/master/js/posts.json";
var loggedUserId = 5;
var usersData;
var postsData;


function showUpdate(){
    $('#udpate').show();
}

function showErrorMessage(){
    showUpdate();
    $('#error').show();

}

function updateStatus(event){
    var jElem = $(event.target).parent().find('#post_text');    
    var post = {};
    post.content= jElem.val();
    post.data="";
    post.userId=loggedUserId;
    post.comments=[];

    var id=0;
    for(var pos in postsData){
        id=pos;
    }
    id++;
    post.postId= id;
    postsData[id]=post;
    loadPosts();
    jElem.val('');
    jElem.closest('#update').hide();
}

function addComment(evt){

    if(evt.charCode === 13 || evt.keyCode === 13){
        var jElem = $(evt.target);
        var post = {};
        var postId=jElem.attr('data-box-post-id')
        post.postId= postId;
        post.content= jElem.val();
        post.data="";
        post.userId=loggedUserId;

        var id=0;
        for(var pos in postsData[postId].comments){
            id=postsData[postId].comments[pos].id;
        }
        if(id == 0)
            id=10;
        else
            id++;

        post.id=id;
        postsData[postId].comments.push(post);
        $('#timeline').empty();
        
        loadPosts();
    }
}

function loadUserInfo(){

    if(typeof usersData == 'undefined'){
        showErrorMessage();
        return;
    }

    var source   = $("#user-template").html();
    var template = Handlebars.compile(source);
    var context = {
        user_image: '../'+usersData[loggedUserId].pic, 
        user_name: usersData[loggedUserId].username, 
        user_text: usersData[loggedUserId].about
    };
    var html    = template(context);
    $('#logged_user').append(html);
}
function loadPosts(){

    if(typeof usersData == 'undefined' || typeof postsData == 'undefined'){
        showErrorMessage();
        return;
    }

    var source   = $("#posts-template").html();
    var template = Handlebars.compile(source);

    var context=[];
    var subpost_info;
    var subpost=[];
    var post;
    var posts= []; 
    var userId=0;

    for(var pos in postsData){
        post={};
        userId=postsData[pos].userId
        post.user_image='../'+usersData[userId].pic;
        post.user_text=usersData[userId].about;
        post.user_name=usersData[userId].username;
        post.user_post=postsData[pos].content;
        post.post_id=pos;

        if(postsData[pos].comments.length > 0){
            subpost=[];
            post.reply=false;
            for(var subpos in postsData[pos].comments){
                subpost_info={}
                userId=postsData[pos].comments[subpos].userId;
                subpost_info.user_image='../'+usersData[userId].pic;
                subpost_info.user_text=usersData[userId].about;
                subpost_info.user_name=usersData[userId].username;
                subpost_info.user_post=postsData[pos].comments[subpos].content
                subpost.push(subpost_info);
            }
            post.reply=subpost;
        }
        posts.push(post);
    }
    context.posts=posts;
    var html    = template(context);
    $('#timeline').append(html);
}

function loadData(){

    var url= userJSONPath+"?callback=?";
    $.ajax({
       type: 'GET',
        url: url,
        async: false,
        jsonpCallback: 'jsonCallbackUser',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
           usersData=json;
           loadUserInfo();
        },
        error: function(e) {
            showErrorMessage();
           console.log(e.message);
        }
    });

    url= postsJSONPath+"?callback=?";
    $.ajax({
       type: 'GET',
        url: url,
        async: false,
        jsonpCallback: 'jsonCallbackPost',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            postsData=json;
            loadPosts();
        },
        error: function(e) {
            showErrorMessage();
           console.log(e.message);
        }
    });
}






