window.fbAsyncInit = ->
  FB.init
    appId: '929983597012726'
    channelUrl: window.facebookChannelFile # Path to your Channel File
    status: true # check login status
    cookie: true # enable cookies to allow the server to access the session
    xfbml: true # parse XFBML
    oauth: true
  $(document).trigger "facebook:ready"
  return

((d, s, id) ->
  js = undefined
  fjs = d.getElementsByTagName(s)[0]
  return  if d.getElementById(id)
  js = d.createElement(s)
  js.id = id
  js.src = "//connect.facebook.net/en_US/all.js"
  fjs.parentNode.insertBefore js, fjs
  return
) document, "script", "facebook-jssdk"

$ ->
  __MomentumFacebookLogin = ->
    FB.login ((response) ->
      if response.authResponse
        $.ajax
          url: "/act/session/connectfacebook"
          type: "POST"
          data:
            "access-token": response.authResponse.accessToken
            "user-id": response.authResponse.userId
            "--delay-facebook-friend-import": true
            "--json": true
            "--login": true

          success: (create_response) ->
            if create_response.success is 1
              $(document).trigger "momentum:facebook-login-success", [create_response]
            else
              $(document).trigger "momentum:facebook-login-error", [create_response]
            return

      else
        $(document).trigger "momentum:facebook-login-cancel"
      return
    ),
      scope: (if not window.facebookLoginScope? then "email,user_likes" else window.facebookLoginScope)

    false


  # Add `rel="facebook-login"` to any link to make it trigger the Facebook dialog.
  $(document).on "click", "a[rel=facebook-login]", __MomentumFacebookLogin

  # Use `$.trigger('momentum:facebook-login')` to trigger the Facebook dialog manually.
  $(document).on "momentum:facebook-login", __MomentumFacebookLogin

  # Default success behavior
  $(document).on "momentum:facebook-login-success", (e, response) ->
    console.log 'Index: ' + window.location.pathname.indexOf "my-storks"
    window.location = "/#/fundraiser/create/1"
    return


  # Default cancel behavior
  $(document).on "momentum:facebook-login-cancel", (e) ->


  # do nothing at all

  # Default error behavior
  $(document).on "momentum:facebook-login-error", (e, response) ->
    alert "Could not create your account with the system. Please try again later. " + response.message
    return