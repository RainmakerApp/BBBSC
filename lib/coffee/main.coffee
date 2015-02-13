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
$('.tab').on 'click', ->
  $(this).addClass('active').siblings().removeClass 'active'
  if ($(this).data('target').length >= 1)
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

fundraiserModal = ->
  canvas  = document.getElementById('canvas')
  process = document.getElementsByClassName('create-fundraiser__wrapper')
  sizing  = document.getElementsByClassName('wrapper_sizing')
  height  = $(sizing).outerHeight()
  if Modernizr['cssfilters']
    $('body')
      .addClass 'create-fundraiser'
    $(canvas)
      .css({
        'max-height': (height + 180) + 'px'
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
  else
    $(canvas).addClass 'overlay'
  return

$('#create__fundraiser').on 'click', ->
  fundraiserModal()

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
    $('#individual').hide()
    $('#group').show()
    show = 2
  else
    $(this).html "<a href='#'>Sign Up as a Group</a>"
    $('#group').hide()
    $('#individual').show()
    show = 1
  return false

# Sample
$('.sample').on 'click', (e)->
  value = $(this).data 'message'
  $(this).parents(':eq(2)').find('textarea').val(value)
  e.preventDefault()

$(window).load ->
  hash = window.location.hash.substr(1)
  if (hash.indexOf('/fundraiser/create') > -1)
    fundraiserModal()
    if (hash.indexOf('/fundraiser/create/1') > -1)
      $('.wrapper__forms-nav')
        .fadeIn()
      $('.step[data-step="1"]')
        .hide()
      $('.step[data-step="2"]')
        .show()
    else
      window.location.hash = '/fundraiser/create'
  else
    elem = document.getElementById(hash)
    console.log(elem)
    $('[data-target='+hash+']')
      .addClass 'active'
      .siblings '.tab'
      .removeClass 'active'
    $(elem)
      .fadeIn '150'
      .siblings '.pane'
      .hide()

$('.submit').on 'click', ->
  current    = $(this).parents('.step')
  next       = $(current).next('.step')
  currentVal = $(current).data('step')
  $(current)
    .fadeOut '150', ->
      $('ul.complete > li[data-related="' + currentVal + '"]')
        .addClass 'complete'
        .html '<span class="num"><i class="fa fa-check"></i></span>'
      $('ul.complete > li[data-related="' + (currentVal + 1) + '"]')
        .css({
          display: 'inline-block'
        })
      $('ul.pending > li[data-related="' + (currentVal + 1) + '"]')
        .css({
          display: 'none'
        })
      $(next)
        .fadeIn(150)
      if (currentVal == 1)
        $('.wrapper__forms-nav')
          .fadeIn()
        $('.wrapper__title')
          .fadeOut()
      else if (currentVal == 5)
        window.location = '/team/team-name.html'
      window.location.hash = '/fundraiser/create/' + currentVal
  return false

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

