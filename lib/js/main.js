(function() {
  var facebookLogin, fundraiserModal, idReplace, isInt, next, show, step;

  isInt = function(value) {
    return !isNaN(value) && (function(x) {
      return (x | 0) === x;
    })(parseFloat(value));
  };

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

  $('span.lgbt').on('click', function() {
    console.log('Testing...');
    $('body').addClass('modal-open');
  });

  $('.overlay').on('click', function(e) {
    if (e.target === $('.overlay')[0]) {
      return $('body').removeClass('modal-open');
    }
  });

  $('.tab').on('click', function() {
    var target;
    $(this).addClass('active').siblings().removeClass('active');
    if ($(this).data('target') && $(this).data('target').length >= 1) {
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
      $('#group').slideToggle();
      show = 2;
    } else {
      $(this).html("<a href='#'>Sign Up as a Group</a>");
      $('#group').slideToggle();
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
    var arr, elem, hash, step;
    hash = window.location.hash.substr(1);
    arr = hash.split('/');
    step = arr[arr.length - 1];
    if (hash.indexOf('/fundraiser/create') > -1) {
      fundraiserModal();
      if (isInt(step)) {
        $('.step[data-step="' + step + '"]').show().siblings('.step').hide();
        if (step === 1) {
          $('.wrapper__forms-nav').slideDown('150');
          return $('.wrapper__title').slideUp('150');
        }
      } else {
        return $('.step[data-step=0]').show().siblings('.step').hide();
      }
    } else if (hash) {
      elem = document.getElementById(hash);
      $('[data-target="' + hash + '"]').addClass('active').siblings('.tab').removeClass('active');
      return $(elem).fadeIn('150').siblings('.pane').hide();
    }
  });

  $(window).on('hashchange', function() {
    var arr, hash, step;
    hash = window.location.hash.substr(1);
    arr = hash.split('/');
    step = arr[arr.length - 1];
    if (step >= 1) {
      $('.wrapper__forms-nav').slideDown('150');
      $('wrapper__title').slideUp('150');
    }
  });

  $(window).on('resize', function() {
    var canvas, height, process, sizing;
    canvas = document.getElementById('canvas');
    process = document.getElementsByClassName('create-fundraiser__wrapper');
    sizing = document.getElementsByClassName('wrapper_sizing');
    height = $(window).height();
    if ($('body').hasClass('create-fundraiser')) {
      return $(canvas).css({
        'max-height': height + 'px',
        'overflow': 'hidden'
      });
    }
  });

  next = function(x) {
    $('div[data-step=' + x + ']').fadeOut('150', function() {
      return $('div[data-step=' + (x + 1) + ']').fadeIn('150', function() {
        window.location.hash = '/fundraiser/create/' + (x + 1);
        $('.wrapper__forms-nav').fadeIn('150');
        $('ul.complete > li[data-related="' + x + '"]').addClass('complete').html('<span class="num"><i class="fa fa-check"></i></span>');
        $('ul.complete > li[data-related="' + (x + 1) + '"]').css({
          display: 'inline-block'
        });
        return $('ul.pending > li[data-related="' + (x + 1) + '"]').css({
          display: 'none'
        });
      });
    });
  };

  window.isGroup = {};

  $('form.ajax:not(#create-fundraiser)').on('submit', function(e) {
    var parent, x;
    parent = $(this).parent('.step');
    x = $(parent).data('step');
    step(x);
    e.preventDefault();
  });

  $('.select__wrapper-gallery .thumb').on('click', function() {
    var action, arr, id, src, wrapper;
    src = $(this).css('background-image');
    src = src.replace('url(', '').replace(')', '');
    $('input[name="fileUrl"]').val(src);
    wrapper = $(this).parents(':eq(2)');
    next = document.getElementsByClassName('upload__wrapper');
    action = $(next).find('form').attr('action');
    arr = action.split('/');
    id = arr[4];
    $(wrapper).fadeOut('150', function() {
      $('.featured__image-container').css({
        'background-image': 'url(' + src + ')'
      });
      return $(next).fadeIn(150);
    });
    $.ajax({
      url: '/api/3.0/groups/' + id + '/attachments',
      type: 'POST',
      data: {
        fileUrl: src
      },
      dataType: 'JSON',
      success: function(data, textStatus, jqXHR) {
        console.log(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var error;
        error = jqXHR.responseJSON;
        return console.log(error.status.message);
      }
    });
  });

  $('form#create-contact').on('submit', function(e) {
    var group;
    if ($('input#group-input').val()) {
      group = $('input#group-input').val();
      console.log(group);
      return $('form#create-fundraiser').find('#name').val(group).parents('form').find('#type').val('team');
    }
  });

  $('form#create-fundraiser').on('submit', function(e) {
    var parent, x;
    parent = $(this).parent('.step');
    x = $(parent).data('step');
    step(x);
    return false;
  });

  step = function(x, cb) {
    var data, form, group, url, urlCon;
    form = $('div[data-step=' + x + '] > form');
    url = $(form).attr('action');
    data = $(form).serializeArray();
    group = $('input#group-input').val();
    urlCon = group ? 'teams' : 'fundraising';
    console.log(group);
    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        if (typeof cb === 'function') {
          cb.call(null, data);
          next(x);
        } else {
          next(x);
          if (x === 1) {
            console.log(urlCon);
            idReplace(data, urlCon);
          }
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var error;
        error = jqXHR.responseJSON;
        $(form).find('.error').html(error.status.message).fadeIn('150');
      }
    });
  };

  idReplace = function(data, url) {
    var action;
    data = data.data;
    action = '/api/3.0/groups/' + data.id;
    $('form.ajax').each(function() {
      return $(this).attr('action', action);
    });
    $('form[name=customPhoto], form[name=fileUrlForm]').attr('action', '/api/3.0/groups/' + data.id + '/attachments').find('input[name=--success]').val('/fundraising/' + data.id).parent('.col').find('input[name=--failure]').val('/fundraising/' + data.id + '?error');
    $('form[name=customPhoto]').find('a.button').attr('href', '/' + url + '/' + data.id);
    return $('#upload').attr('data-id', data.id);
  };

  fundraiserModal = function(team) {
    var canvas, height, process, sizing;
    canvas = document.getElementById('canvas');
    process = document.getElementsByClassName('create-fundraiser__wrapper');
    sizing = document.getElementsByClassName('wrapper_sizing');
    height = $(window).height();
    if (Modernizr['cssfilters']) {
      $('body').addClass('create-fundraiser');
      $(canvas).css({
        'max-height': height + 'px',
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
      if (team === true) {
        $('select[name=type]').val('team');
      } else {
        $('select[name=type]').val('fundraiser');
      }
    } else {
      $(canvas).addClass('overlay');
    }
  };

  $('#create__fundraiser').on('click', function() {
    window.location.hash = '/fundraiser/create';
    fundraiserModal();
    return false;
  });

  $('.create__fundraiser').on('click', function() {
    var team;
    window.location.hash = '/fundraiser/create';
    team = $(this).data('team');
    if (team === true) {
      fundraiserModal(team);
    } else {
      fundraiserModal();
    }
    return false;
  });

  $('#upload').on('click', function() {
    var id;
    id = $(this).data('id');
    return $(this).ajaxfileupload({
      action: '/api/3.0/groups/' + id + '/attachments',
      onComplete: function(response) {
        $('.featured__image-container').css({
          'background-image': 'url(' + response.data.raw + ')'
        });
        $('.upload-button').find('span').html('<small>' + response.data.name + '</small>');
      },
      onStart: function() {
        $('.upload-button').find('span').html('Uploading <i class="fa fa-spin fa-spinner fa-pulse"></i>');
      }
    });
  });

  $('#customPhoto').on('click', function() {
    var id;
    id = $(this).data('id');
    return $(this).ajaxfileupload({
      action: '/api/3.0/contacts/me/attachments',
      onComplete: function(response) {
        $('.banner-area_featured').css({
          'background-image': 'url(' + response.data.raw + ')'
        }).addClass('change');
        $('.upload-button').text(response.data.name);
        setTimeout($('.modal').removeClass('active', 3000));
        $.ajax({
          type: 'POST',
          url: '/api/3.0/contacts/me/',
          async: false,
          data: {
            prop: {
              'prefer-facebook': 0
            }
          },
          success: function() {
            console.log('You now prefer to use your uploaded photo.');
          }
        });
      },
      onStart: function() {
        $('.upload-button').html('Uploading <i class="fa fa-spin fa-spinner fa-pulse"></i>');
      }
    });
  });

  facebookLogin = function() {
    var checkLoginState, statusChangeCallback;
    statusChangeCallback = function(response) {
      if (response.status === 'connected') {
        $.post('/api/3.0/session/from-facebook', response.authResponse);
        window.location.href = window.location.href;
      }
    };
    checkLoginState = function() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    };
    window.fbAsyncInit = function() {
      FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v2.1'
      });
    };
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
    (function(d, s, id) {
      var fjs, js;
      js = void 0;
      fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  };

  $('#facebook__login').on('click', function() {
    facebookLogin();
    $.ajax({
      type: 'POST',
      url: '/api/3.0/contacts/me/',
      async: false,
      data: {
        prop: {
          'prefer-facebook': 1
        }
      },
      success: function() {
        console.log('You now prefer to use your facebook photo.');
      }
    });
    return false;
  });

  $('.upload').on('click', function() {
    return $('.modal').addClass('active');
  });

  $('#background').on('click', function(e) {
    if (e.target.id === 'background') {
      return $('.modal').removeClass('active');
    }
  });

  $('.subscribe').on('submit', function() {
    var $this, data;
    $this = $(this);
    data = $(this).serialize();
    console.log(data);
    $.ajax({
      url: '/api/3.0/contacts',
      type: 'POST',
      data: data,
      dataType: 'JSON',
      success: function(data, textStatus, jqXHR) {
        $this.fadeOut(150, function() {
          return $this.html('<h2>Thanks for subscribing!</h2>').fadeIn(150);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var error;
        error = jqXHR.responseJSON;
        return $this.find('h1').fadeOut(150, function() {
          return $this.find('.error').html(error.status.message).fadeIn(150);
        });
      }
    });
    return false;
  });

  $('#select__wrapper').on('click', function() {
    var wrapper;
    wrapper = $(this).parents(':eq(3)');
    next = document.getElementsByClassName('select__wrapper');
    $(wrapper).fadeOut('150', function() {
      return $(next).fadeIn(150);
    });
    return false;
  });

  $('#upload__wrapper').on('click', function() {
    var wrapper;
    wrapper = $(this).parents(':eq(3)');
    next = document.getElementsByClassName('upload__wrapper');
    $(wrapper).fadeOut('150', function() {
      return $(next).fadeIn(150);
    });
    return false;
  });

  $('select[name="type"]').on('change', function() {
    var end, val;
    val = $(this).val();
    if (val.indexOf('event') > -1) {
      end = $('select[name="prop.eventName"] option:selected').data('end');
      $('.event-list').slideDown();
      $('.date').slideUp();
      $('input[name="date_until"]').val(end);
    } else {
      $('.event-list').slideUp();
      $('.date').slideDown();
      $('input[name="date_until"]').val('');
    }
  });

  $('select[name="prop.eventName"]').on('change', function() {
    var end;
    end = $('option:selected', this).data('end');
    $('.date').slideUp();
    return $('.date').val(end);
  });

  $('#m, #d, #y').on('blur keydown keyup', function() {
    var date, day, end, month, year;
    month = $('#m').val();
    day = $('#d').val();
    year = $('#y').val();
    date = month + '/' + day + '/' + year;
    end = $('input[name="date_until"]');
    $(end).val(date);
  });

  $('.show__event').each(function() {
    return $(this).on('click', function() {
      var target;
      target = $(this).data('target');
      $('body').addClass('glass-event');
      $('#' + target).addClass('in');
      return window.scrollTo(0, 0);
    });
  });

  $('.body__header li').on('click', function() {
    var id, target;
    target = $(this).data('target');
    id = $(this).attr('id');
    $(this).addClass('active').siblings().removeClass('active');
    if (target !== 'overview') {
      $('.button-group').css({
        opacity: 0,
        marginTop: 0
      });
    } else {
      $('.button-group').css({
        opacity: 1,
        marginTop: '25px'
      });
    }
    if (id) {
      $('.tab-' + id).addClass('in').siblings('.in').removeClass('in');
    }
    $(this).parents('.wrapper__body').find('.' + target).addClass('in').siblings().removeClass('in');
    return console.log();
  });

  $(window).load(function() {
    var arr, eventID, hash;
    hash = window.location.hash.substr(1);
    arr = hash.split('/');
    eventID = arr[arr.length - 1];
    console.log(hash);
    if (hash.indexOf('event') > -1) {
      $('#' + eventID).addClass('in');
      return $('body').addClass('glass-event');
    }
  });

  $('.glass-event__wrapper').on('click', function(e) {
    $('.glass-event__wrapper.in').removeClass('in');
    return $('body').removeClass('glass-event');
  });

  $('.wrapper__body span.shut').on('click', function(e) {
    var target;
    target = $(this).data('target');
    $('.glass-event__wrapper.in').removeClass('in');
    return $('body').removeClass('glass-event');
  });

  $('.wrapper__body').on('click', function(e) {
    return e.stopPropagation();
  });

  $('.nav a').on('click', function() {
    var className, current;
    className = this.className.split(' ')[0];
    console.log(className);
    if (className === 'back') {
      current = parseInt($('.body__header').find('.active').attr('id')) - 1;
      console.log(current);
      return $('#' + current).click();
    } else if (className === 'next') {
      current = parseInt($('.body__header').find('.active').attr('id')) + 1;
      console.log(current);
      $('#' + current).click();
      if (current === 5) {
        console.log('Should work!');
        $('.nav a.next').text('Submit');
      }
      if (current === 6) {
        $('.nav a.prev').hide();
        return $('.nav a.next').hide();
      }
    }
  });

}).call(this);
