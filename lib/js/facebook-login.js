(function() {
  window.fbAsyncInit = function() {
    FB.init({
      appId: '929983597012726',
      channelUrl: window.facebookChannelFile,
      status: true,
      cookie: true,
      xfbml: true,
      oauth: true
    });
    $(document).trigger("facebook:ready");
  };

  (function(d, s, id) {
    var fjs, js;
    js = void 0;
    fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");

  $(function() {
    var __MomentumFacebookLogin;
    __MomentumFacebookLogin = function() {
      FB.login((function(response) {
        if (response.authResponse) {
          $.ajax({
            url: "/act/session/connectfacebook",
            type: "POST",
            data: {
              "access-token": response.authResponse.accessToken,
              "user-id": response.authResponse.userId,
              "--delay-facebook-friend-import": true,
              "--json": true,
              "--login": true
            },
            success: function(create_response) {
              if (create_response.success === 1) {
                $(document).trigger("momentum:facebook-login-success", [create_response]);
              } else {
                $(document).trigger("momentum:facebook-login-error", [create_response]);
              }
            }
          });
        } else {
          $(document).trigger("momentum:facebook-login-cancel");
        }
      }), {
        scope: (window.facebookLoginScope == null ? "email,user_likes" : window.facebookLoginScope)
      });
      return false;
    };
    $(document).on("click", "a[rel=facebook-login]", __MomentumFacebookLogin);
    $(document).on("momentum:facebook-login", __MomentumFacebookLogin);
    $(document).on("momentum:facebook-login-success", function(e, response) {
      console.log('Index: ' + window.location.pathname.indexOf("my-storks"));
      window.location = "/#/fundraiser/create/1";
    });
    $(document).on("momentum:facebook-login-cancel", function(e) {});
    return $(document).on("momentum:facebook-login-error", function(e, response) {
      alert("Could not create your account with the system. Please try again later. " + response.message);
    });
  });

}).call(this);
