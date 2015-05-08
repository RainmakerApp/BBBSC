# Int Function
isInt = (value) ->
  !isNaN(value) and ((x) ->
    (x | 0) == x
  )(parseFloat(value))

$('a#fundraiserMenu').on 'click', ->
  $(this).find('i').toggleClass 'active'
  $('.laptop-menu').toggleClass 'show'
  return
  
$('i#md-navigation').on 'click', ->
  $(this).toggleClass 'active'
  $('.laptop-menu').toggleClass 'show'
  return

$('i#sm-navigation').on 'click', ->
  $(this).toggleClass 'active'
  $('body').toggleClass 'show-mobile'
  return

$('span.lgbt').on 'click', ->
  console.log 'Testing...'
  $('body').addClass 'modal-open'
  return

$('.overlay').on 'click', (e)->
  if e.target is $('.overlay')[0]
    $('body').removeClass 'modal-open'

$('.tab').on 'click', ->
  $(this).addClass('active').siblings().removeClass 'active'
  if ($(this).data('target') && $(this).data('target').length >= 1)
    target = $(this).data 'target'
    $('.pane#' + target)
      .fadeIn '150'
      .addClass 'active'
      .siblings '.pane'
      .removeClass 'active'
      .hide()
    history.pushState(null, null, '#' + target);
  return

$('.faq li').on 'click', ->
  $(this).addClass('active').siblings().removeClass 'active'
  return

$('.ticket select').on 'change', ->
  amount = $('select[name=ticket-amount]').val()
  type = $('select[name=ticket-type]').val()
  $('.ticket .total > p').text '$' + amount * type
  return

# Radical Form Styles
$('.input-group:not(.split)').each ->
  $('input, textarea').on 'focus', ->
    parent = $(this).parent('.input-group')
    $(parent).addClass 'focus'
  $('input, textarea').on 'blur', ->
    parent = $(this).parent('.input-group')
    $(parent).removeClass 'focus'
$('.input-group.split').each ->
  $('input, textarea').on 'focus', ->
    parent = $(this).closest('.input-group')
    $(parent).addClass 'focus'
  $('input, textarea').on 'blur', ->
    parent = $(this).closest('.input-group')
    $(parent).removeClass 'focus'

# Toggle
show = 1
$('#toggle-type').on 'click', ->
  if (show == 1)
    $(this).html "<a href='#'>Sign Up as an Individual</a>"
    $('#group').slideToggle()
    show = 2
  else
    $(this).html "<a href='#'>Sign Up as a Group</a>"
    $('#group').slideToggle()
    show = 1
  return false

# Sample
$('.sample').on 'click', (e)->
  value = $(this).data 'message'
  $(this).parents(':eq(2)').find('textarea').val(value)
  e.preventDefault()

$(window).load ->
  hash = window.location.hash.substr(1)
  arr  = hash.split('/')
  step = arr[(arr.length - 1)]
  if (hash.indexOf('/fundraiser/create') > -1)
    fundraiserModal()
    if (isInt(step))
      $('.step[data-step="'+step+'"]')
        .show()
        .siblings('.step')
        .hide()
        if (step == 1)
          $('.wrapper__forms-nav')
            .slideDown '150'
          $('.wrapper__title')
            .slideUp '150'
        # else if (step >= 2)
        #   window.location.hash = '/fundraiser/create/1'
    else
      $('.step[data-step=0]')
        .show()
        .siblings('.step')
        .hide()
  else if (hash)
    elem = document.getElementById(hash)
    $('[data-target="'+hash+'"]')
      .addClass 'active'
      .siblings '.tab'
      .removeClass 'active'
    $(elem)
      .fadeIn '150'
      .siblings '.pane'
      .hide()

$(window).on 'hashchange', ->
  hash = window.location.hash.substr(1)
  arr  = hash.split('/')
  step = arr[(arr.length - 1)]
  if step >= 1
    $('.wrapper__forms-nav')
      .slideDown '150'
    $('wrapper__title')
      .slideUp '150'
  return

$(window).on 'resize', ->
  canvas  = document.getElementById('canvas')
  process = document.getElementsByClassName('create-fundraiser__wrapper')
  sizing  = document.getElementsByClassName('wrapper_sizing')
  height  = $(window).height()
  if $('body').hasClass 'create-fundraiser'
    $(canvas)
      .css({
        'max-height': height + 'px'
        'overflow': 'hidden'
      })

next = (x)->
  $('div[data-step=' + x + ']')
    .fadeOut '150', ->
      $('div[data-step=' + (x + 1) + ']')
        .fadeIn '150', ->
          window.location.hash = '/fundraiser/create/' + (x + 1)
          $('.wrapper__forms-nav').fadeIn '150'
          $('ul.complete > li[data-related="' + x + '"]')
            .addClass 'complete'
            .html '<span class="num"><i class="fa fa-check"></i></span>'
          $('ul.complete > li[data-related="' + (x + 1) + '"]')
            .css({
              display: 'inline-block'
            })
          $('ul.pending > li[data-related="' + (x + 1) + '"]')
            .css({
              display: 'none'
            })
  return

window.isGroup = {}

$('form.ajax:not(#create-fundraiser)').on 'submit', (e)->
  parent = $(this).parent '.step'
  x      = $(parent).data 'step'
  step x
  e.preventDefault()
  return

$('.select__wrapper-gallery .thumb').on 'click', ->
  src = $(this).css 'background-image'
  src = src.replace('url(', '').replace(')', '')
  $('input[name="fileUrl"]').val src
  wrapper = $(this).parents(':eq(2)')
  next    = document.getElementsByClassName('upload__wrapper')
  action  = $(next).find('form').attr('action')
  arr     = action.split('/')
  id      = arr[4]
  $(wrapper)
    .fadeOut '150', ->
      $('.featured__image-container')
        .css
          'background-image': 'url('+src+')'
      $(next)
        .fadeIn(150)
  $.ajax
    url: '/api/3.0/groups/'+id+'/attachments'
    type: 'POST'
    data: {fileUrl: src}
    dataType: 'JSON'
    success: (data, textStatus, jqXHR) ->
      console.log data
      return
    error: (jqXHR, textStatus, errorThrown) ->
      error = jqXHR.responseJSON
      console.log error.status.message
  return

# Create Group if Appropriate
$('form#create-contact').on 'submit', (e)->
  if ($('input#group-input').val())
    group = $('input#group-input').val()
    console.log group
    $('form#create-fundraiser')
      .find '#name'
      .val group
      .parents 'form'
      .find '#type'
      .val 'team'

$('form#create-fundraiser').on 'submit', (e)->
  parent = $(this).parent '.step'
  x      = $(parent).data 'step'
  step x
  return false

# Advance Steps with
# AJAX post
step = (x, cb)->
  form   = $('div[data-step='+x+'] > form')
  url    = $(form).attr 'action'
  data   = $(form).serializeArray()
  group  = $('input#group-input').val()
  urlCon = if group then 'teams' else 'fundraising'
  console.log group
  $.ajax
    url: url
    type: 'POST'
    data: data
    dataType: 'json'
    success: (data, textStatus, jqXHR) ->
      if typeof cb is 'function'
        cb.call null, data
        next x
      else
        next x
        if x == 1
          console.log urlCon
          idReplace data, urlCon
      return
    error: (jqXHR, textStatus, errorThrown) ->
      error = jqXHR.responseJSON
      $(form)
        .find '.error'
          .html error.status.message
          .fadeIn '150'
      return
  return

# Replace {group.id} W/
# Newly created Group ID
idReplace = (data, url) ->
  data   = data.data
  action = '/api/3.0/groups/' + data.id
  $('form.ajax').each ->
    $(this).attr 'action', action
  $('form[name=customPhoto], form[name=fileUrlForm]')
    .attr 'action', '/api/3.0/groups/' + data.id + '/attachments'
    .find 'input[name=--success]'
      .val '/fundraising/' + data.id
      .parent '.col'
        .find 'input[name=--failure]'
          .val '/fundraising/' + data.id + '?error'
  $('form[name=customPhoto]')
    .find 'a.button'
    .attr 'href', '/' + url + '/' + data.id
  $('#upload')
    .attr('data-id', data.id)

# Function to Load Fundraiser Modal
fundraiserModal = (team)->
  canvas  = document.getElementById('canvas')
  process = document.getElementsByClassName('create-fundraiser__wrapper')
  sizing  = document.getElementsByClassName('wrapper_sizing')
  height  = $(window).height()
  if Modernizr['cssfilters']
    $('body')
      .addClass 'create-fundraiser'
    $(canvas)
      .css({
        'max-height': height + 'px'
        'overflow': 'hidden'
      })
    $('.close-modal').on 'click', ->
      $('body')
        .removeClass 'create-fundraiser'
      $(canvas)
        .css({
          'max-height': 'none'
          'overflow': 'visible'
        })
      window.location.hash = ''
    if team is true
      $('select[name=type]').val 'team'
    else
      $('select[name=type]').val 'fundraiser'
  else
    $(canvas).addClass 'overlay'
  return

# Fundraiser Modal Function Trigger
$('#create__fundraiser').on 'click', ->
  window.location.hash = '/fundraiser/create'
  fundraiserModal()
  return false

$('.create__fundraiser').on 'click', ->
  window.location.hash = '/fundraiser/create'
  team = $(this).data 'team'
  if team is true
    fundraiserModal(team)
  else
    fundraiserModal()
  return false

# File Upload Functionality
$('#upload').on 'click', ->
  id = $(this).data 'id'
  $(this).ajaxfileupload
    action: '/api/3.0/groups/'+id+'/attachments'
    onComplete: (response) ->
      $('.featured__image-container')
        .css
          'background-image': 'url('+response.data.raw+')'
      $('.upload-button')
        .find 'span'
        .html '<small>' + response.data.name + '</small>'
      return
    onStart: ->
      $('.upload-button')
        .find 'span'
        .html 'Uploading <i class="fa fa-spin fa-spinner fa-pulse"></i>'
      return

# Upload Custom Photo
$('#customPhoto').on 'click', ->
  id = $(this).data 'id'
  $(this).ajaxfileupload
    action: '/api/3.0/contacts/me/attachments'
    onComplete: (response) ->
      $('.banner-area_featured')
        .css
          'background-image': 'url('+response.data.raw+')'
        .addClass 'change'
      $('.upload-button')
        .text response.data.name
        setTimeout $('.modal').removeClass 'active', 3000
      $.ajax
        type: 'POST'
        url: '/api/3.0/contacts/me/'
        async: false,
        data: { prop: { 'prefer-facebook': 0 } },
        success: ->
          console.log('You now prefer to use your uploaded photo.');
          return;
      return
    onStart: ->
      $('.upload-button')
        .html 'Uploading <i class="fa fa-spin fa-spinner fa-pulse"></i>'
      return

facebookLogin = ->

  statusChangeCallback = (response) ->
    # The response object is returned with a status field that lets the
    # app know the current login status of the person.
    # Full docs on the response object can be found in the documentation
    # for FB.getLoginStatus().
    if response.status == 'connected'
      # Logged into your app and Facebook.
      $.post '/api/3.0/session/from-facebook', response.authResponse
      window.location.href = window.location.href
    return

  checkLoginState = ->
    FB.getLoginStatus (response) ->
      statusChangeCallback response
      return
    return

  window.fbAsyncInit = ->
    FB.init
      appId: facebookAppId
      cookie: true
      xfbml: true
      version: 'v2.1'
    return

  FB.getLoginStatus (response) ->
    statusChangeCallback response
    return
  # Load the SDK asynchronously
  ((d, s, id) ->
    js = undefined
    fjs = d.getElementsByTagName(s)[0]
    if d.getElementById(id)
      return
    js = d.createElement(s)
    js.id = id
    js.src = '//connect.facebook.net/en_US/sdk.js'
    fjs.parentNode.insertBefore js, fjs
    return
  ) document, 'script', 'facebook-jssdk'
  return

$('#facebook__login').on 'click', ->
  facebookLogin()
  $.ajax
    type: 'POST'
    url: '/api/3.0/contacts/me/'
    async: false,
    data: { prop: { 'prefer-facebook': 1 } },
    success: ->
      console.log('You now prefer to use your facebook photo.');
      return;
  return false

$('.upload').on 'click', ->
  $('.modal').addClass 'active'

$('#background').on 'click', (e) ->
  if e.target.id is 'background'
    $('.modal').removeClass 'active'

$('.subscribe').on 'submit', ->
  $this = $(this)
  data = $(this).serialize()
  console.log data
  $.ajax
    url: '/api/3.0/contacts'
    type: 'POST'
    data: data
    dataType: 'JSON'
    success: (data, textStatus, jqXHR) ->
      $this
        .fadeOut 150, ->
          $this
            .html '<h2>Thanks for subscribing!</h2>'
            .fadeIn 150
      return
    error: (jqXHR, textStatus, errorThrown) ->
      error = jqXHR.responseJSON
      $this
        .find 'h1'
        .fadeOut 150, ->
          $this
            .find '.error'
            .html error.status.message
            .fadeIn 150
  false

$('#select__wrapper').on 'click', ->
  wrapper = $(this).parents(':eq(3)')
  next    = document.getElementsByClassName('select__wrapper')
  $(wrapper)
    .fadeOut '150', ->
      $(next)
        .fadeIn(150)
  return false

$('#upload__wrapper').on 'click', ->
  wrapper = $(this).parents(':eq(3)')
  next    = document.getElementsByClassName('upload__wrapper')
  $(wrapper)
    .fadeOut '150', ->
      $(next)
        .fadeIn(150)
  return false

$('select[name="type"]').on 'change', ->
  val = $(this).val()
  if val.indexOf('event') > -1
    end = $('select[name="prop.eventName"] option:selected').data 'end'
    $('.event-list').slideDown()
    $('.date').slideUp()
    $('input[name="date_until"]').val end
  else
    $('.event-list').slideUp()
    $('.date').slideDown()
    $('input[name="date_until"]').val ''
  return

$('select[name="prop.eventName"]').on 'change', ->
  end = $('option:selected', this).data 'end'
  $('.date').slideUp()
  $('.date').val(end)

$('#m, #d, #y').on 'blur keydown keyup', ->
  month = $('#m').val()
  day   = $('#d').val()
  year  = $('#y').val()
  date  = month + '/' + day + '/' + year
  end   = $('input[name="date_until"]')
  $(end).val date
  return

$('.show__event').each ->
  $(this).on 'click', ->
    target = $(this).data 'target'
    $('body').addClass 'glass-event'
    $('#' + target).addClass 'in'
    window.scrollTo(0, 0);

$('.body__header li').on 'click', ->
  target = $(this).data 'target'
  id     = $(this).attr 'id'
  $(this).addClass('active').siblings().removeClass 'active'
  if target != 'overview'
    $('.button-group').css
      opacity: 0
      marginTop: 0
  else
    $('.button-group').css
      opacity: 1
      marginTop: '25px'
  if id
    $('.tab-' + id)
      .addClass('in')
      .siblings('.in')
      .removeClass 'in'
  $(this).parents('.wrapper__body').find('.' + target).addClass('in').siblings().removeClass 'in'
  console.log()

# $('.nano').nanoScroller()

$(window).load ->
  hash = window.location.hash.substr(1)
  arr  = hash.split('/')
  eventID = arr[(arr.length - 1)]
  console.log hash
  if hash.indexOf('event') > -1
    $('#' + eventID).addClass 'in'
    $('body').addClass 'glass-event'

$('.glass-event__wrapper').on 'click', (e)->
  $('.glass-event__wrapper.in').removeClass 'in'
  $('body').removeClass 'glass-event'

$('.wrapper__body span.shut').on 'click', (e)->
  target = $(this).data 'target'
  $('.glass-event__wrapper.in').removeClass 'in'
  $('body').removeClass 'glass-event'

$('.wrapper__body').on 'click', (e)->
  e.stopPropagation()

$('.nav a').on 'click', ->
  className = this.className.split(' ')[0]
  console.log className
  if className == 'back'
    current = parseInt($('.body__header').find('.active').attr('id')) - 1
    console.log current
    $('#' + current).click()
  else if className == 'next'
    current = parseInt($('.body__header').find('.active').attr('id')) + 1
    console.log current
    $('#' + current).click()
    if current == 5
      console.log 'Should work!'
      $('.nav a.next').text 'Submit'
    if current == 6
      $('.nav a.prev').hide()
      $('.nav a.next').hide()