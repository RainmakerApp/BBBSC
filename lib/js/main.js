(function() {
  var fundraiserModal, show;

  $('a#fundraiserMenu').on('click', function() {
    $(this).find('i').toggleClass('active');
    $('.laptop-menu').toggleClass('show');
  });

  $('i#md-navigation').on('click', function() {
    $(this).toggleClass('active');
    $('.laptop-menu').toggleClass('show');
  });

  $('i#sm-navigation').on('click', function() {
    $(this).toggleClass('active');
    $('body').toggleClass('show-mobile');
  });

  $('.tab').on('click', function() {
    var target;
    $(this).addClass('active').siblings().removeClass('active');
    if ($(this).data('target').length >= 1) {
      target = $(this).data('target');
      $('.pane#' + target).fadeIn('150').addClass('active').siblings('.pane').removeClass('active').hide();
      history.pushState(null, null, '#' + target);
    }
  });

  $('.faq li').on('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
  });

  $('.ticket select').on('change', function() {
    var amount, type;
    amount = $('select[name=ticket-amount]').val();
    type = $('select[name=ticket-type]').val();
    $('.ticket .total > p').text('$' + amount * type);
  });

  fundraiserModal = function() {
    var canvas, height, process, sizing;
    canvas = document.getElementById('canvas');
    process = document.getElementsByClassName('create-fundraiser__wrapper');
    sizing = document.getElementsByClassName('wrapper_sizing');
    height = $(sizing).outerHeight();
    if (Modernizr['cssfilters']) {
      $('body').addClass('create-fundraiser');
      $(canvas).css({
        'max-height': (height + 180) + 'px',
        'overflow': 'hidden'
      });
      $('.close-modal').on('click', function() {
        $('body').removeClass('create-fundraiser');
        $(canvas).css({
          'max-height': 'none',
          'overflow': 'visible'
        });
        return window.location.hash = '';
      });
    } else {
      $(canvas).addClass('overlay');
    }
  };

  $('#create__fundraiser').on('click', function() {
    return fundraiserModal();
  });

  $('.input-group:not(.split)').each(function() {
    $('input, textarea').on('focus', function() {
      var parent;
      parent = $(this).parent('.input-group');
      return $(parent).addClass('focus');
    });
    return $('input, textarea').on('blur', function() {
      var parent;
      parent = $(this).parent('.input-group');
      return $(parent).removeClass('focus');
    });
  });

  $('.input-group.split').each(function() {
    $('input, textarea').on('focus', function() {
      var parent;
      parent = $(this).closest('.input-group');
      return $(parent).addClass('focus');
    });
    return $('input, textarea').on('blur', function() {
      var parent;
      parent = $(this).closest('.input-group');
      return $(parent).removeClass('focus');
    });
  });

  show = 1;

  $('#toggle-type').on('click', function() {
    if (show === 1) {
      $(this).html("<a href='#'>Sign Up as an Individual</a>");
      $('#individual').hide();
      $('#group').show();
      show = 2;
    } else {
      $(this).html("<a href='#'>Sign Up as a Group</a>");
      $('#group').hide();
      $('#individual').show();
      show = 1;
    }
    return false;
  });

  $('.sample').on('click', function(e) {
    var value;
    value = $(this).data('message');
    $(this).parents(':eq(2)').find('textarea').val(value);
    return e.preventDefault();
  });

  $(window).load(function() {
    var elem, hash;
    hash = window.location.hash.substr(1);
    if (hash.indexOf('/fundraiser/create') > -1) {
      fundraiserModal();
      if (hash.indexOf('/fundraiser/create/1') > -1) {
        $('.wrapper__forms-nav').fadeIn();
        $('.step[data-step="1"]').hide();
        return $('.step[data-step="2"]').show();
      } else {
        return window.location.hash = '/fundraiser/create';
      }
    } else {
      elem = document.getElementById(hash);
      console.log(elem);
      $('[data-target=' + hash + ']').addClass('active').siblings('.tab').removeClass('active');
      return $(elem).fadeIn('150').siblings('.pane').hide();
    }
  });

  $('.submit').on('click', function() {
    var current, currentVal, next;
    current = $(this).parents('.step');
    next = $(current).next('.step');
    currentVal = $(current).data('step');
    $(current).fadeOut('150', function() {
      $('ul.complete > li[data-related="' + currentVal + '"]').addClass('complete').html('<span class="num"><i class="fa fa-check"></i></span>');
      $('ul.complete > li[data-related="' + (currentVal + 1) + '"]').css({
        display: 'inline-block'
      });
      $('ul.pending > li[data-related="' + (currentVal + 1) + '"]').css({
        display: 'none'
      });
      $(next).fadeIn(150);
      if (currentVal === 1) {
        $('.wrapper__forms-nav').fadeIn();
        $('.wrapper__title').fadeOut();
      } else if (currentVal === 5) {
        window.location = '/team/team-name.html';
      }
      return window.location.hash = '/fundraiser/create/' + currentVal;
    });
    return false;
  });

  $('#select__wrapper').on('click', function() {
    var next, wrapper;
    wrapper = $(this).parents(':eq(3)');
    next = document.getElementsByClassName('select__wrapper');
    $(wrapper).fadeOut('150', function() {
      return $(next).fadeIn(150);
    });
    return false;
  });

  $('#upload__wrapper').on('click', function() {
    var next, wrapper;
    wrapper = $(this).parents(':eq(3)');
    next = document.getElementsByClassName('upload__wrapper');
    $(wrapper).fadeOut('150', function() {
      return $(next).fadeIn(150);
    });
    return false;
  });

}).call(this);
