(function(){
  'use strict';

  var onBoardingPanel = document.getElementById("onboarding");
  var onBoardingButton = document.getElementById("dismiss-onboarding");

  // Loading
  $( document ).ready(function() {

    $("#sound-on, #anim-off").on( "mouseenter mouseleave", function(){
      var target = $(this).data('target');
      $(document.getElementById(target)).toggleClass("highlighted");
    });

    $("html").addClass("loaded").removeClass("loading");
    // Open onboarding panel
    $(onBoardingPanel).addClass("in-focus");
    moveDashboard($(onBoardingPanel));

    // GA download menu actions
    $('.non-ff .ff-download a, .non-ff a.download').each(function(idx, link) {
      $(link).click(function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Firefox Download',
          eventAction: 'click',
          eventLabel: 'Download Firefox from non-Firefox browser'
        });
      });
    });

    $('.ff .ff-download a, .ff a.download').each(function(idx, link) {
      $(link).click(function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Firefox Download',
          eventAction: 'click',
          eventLabel: 'Download Firefox from Firefox browser'
        });
      });
    });
  });

  // Dismiss On-boarding panel
  onBoardingButton.addEventListener("click", function(){
    onBoardingPanel.classList.remove("in-focus");
    closeDashboard();
    $("html").addClass("class-dismissed");
    // show hustle arrow
    document.getElementById("start").classList.add("begin");
    this.removeEventListener("click");
    $("#sound-on, #anim-off").off( "mouseenter mouseleave");
  });

  // GA right click
  $(document).click(function(e) {
    if (e.button === 2) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Keyboard',
        eventAction: 'click',
        eventLabel: 'Right click activated'
      });
    }
  });

  var videos = document.getElementsByTagName('video');

  var sendVideoGAEnd = function(video) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Video Interactions',
      eventAction: 'complete',
      eventLabel: $(this).closest('.challenge').data('creature')
    });
  };

  var sendVideoGAPlay = function() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Video Interactions',
      eventAction: 'play',
      eventLabel: $(this).closest('.challenge').data('creature')
    });
  };

  Array.prototype.forEach.call(videos, function(child) {
    // GA video click
    child.addEventListener('play', sendVideoGAPlay.bind(child), false);
    child.addEventListener('ended', sendVideoGAEnd.bind(child), false);
  });

  // Detect non-Firefox 44+
  var match = window.navigator.userAgent.match(/Gecko\/\d+ Firefox\/(\d+)/i);
  if (!match || parseInt(match[1]) < 44) {
    $('html').addClass('non-ff');
  } else {
    $('html').addClass('ff');
  }

  function closeDashboard(){
    dashboardOpen = false;
    $("#tabs").children(".tab").removeClass("active");
    $("#dashboard").find(".panel").removeClass("in-focus");
    $("#control-panel").removeAttr("style");
    $("html").removeClass("dashOpen");
  };

  $("#tabs").on( "mouseenter mouseleave", ".tab", function(e){
    $("#control-panel").toggleClass("hovered");
  });

  $("#tabs").on( "mouseenter", ".active", function(e){
    setDashboardHeight($(".in-focus"), ".33rem");
  });

  $("#tabs").on( "mouseleave", ".active", function(e){
    setDashboardHeight($(".in-focus"));
  });

  $("#tabs").on("click", ".tab", function(){
    var $pair = $(this).attr("data-panel");
    var $panel = $("#dashboard").find("[data-panel='" + $pair + "']");

    if ($(this).hasClass("active")) {
      // close it out
      closeDashboard();

    } else {
      // assume nothing or anything is open

      $("#tabs").children(".tab").removeClass("active");
      $(this).addClass("active");

      $("#dashboard").find(".panel").removeClass("in-focus");
      $panel.addClass("in-focus");

      moveDashboard($panel);

      // Start listening for escape key!
      document.addEventListener('keydown', function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27 && dashboardOpen) {
          closeDashboard();
          document.removeEventListener('keydown');
        }
      });

    }
  });


  var zoneListeners = [];
  var currentZone;
  function zoneChanged(zoneEl) {
    currentZone = zoneEl;
    zoneListeners.forEach(function (listener) {
      listener(zoneEl);
    });
  }
  function onZoneChanged(fn) {
    zoneListeners.push(fn);
    if (currentZone) {
      fn(currentZone);
    }
  }

  var zones = document.getElementsByClassName('zone');

  Array.prototype.forEach.call(zones, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        this.element.classList.add('in-zone');
        zoneChanged(this.element);
        $("body").removeClass().addClass(this.element.id);
      },
      // entered: function(direction) {
      // },
      // exit: function(direction) {
      // },
      exited: function(direction) {
        this.element.classList.remove('in-zone');
      }
    });
  });

  var segments = document.getElementsByClassName('segment');

  // Track current depth for calculating scroll animations
  var currentDepth;

  Array.prototype.forEach.call(segments, function(child) {
    new Waypoint.Inview({
      element: child,
      indicator: child.getAttribute("data-progress-item"),
      enter: function(direction) {
        this.element.classList.add('in-view');
        currentDepth = this.element.id.slice(1);
        // lighting up the progress bar
        if (this.options.indicator) {
          document.getElementById(this.options.indicator).classList.add('in-view');
        }
      },
      entered: function(direction) {
        // this.element.classList.add('viz-focus');
      },
      exit: function(direction) {
        // this.element.classList.remove('viz-focus');
      },
      exited: function(direction) {
        this.element.classList.remove('in-view');
        // lighting up the progress bar
        if (this.options.indicator) {
          document.getElementById(this.options.indicator).classList.remove('in-view');
        }
      }
    });
  });

  /* Control Toggles */
  $(".toggle").on("click", function(){
    $(this).toggleClass("activated");
    // GA toggle animation / audio
    ga('send', {
      hitType: 'event',
      eventCategory: 'Toggle',
      eventAction: 'click',
      eventLabel: this.id
    });
  });

  $("#animation").on("click", function(){
    $("html").toggleClass("animated");
  });

  var $wrapper = $('.wrapper');

  var challenges = document.getElementsByClassName('challenge');

  Array.prototype.forEach.call(challenges, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        var creature = this.element.getAttribute('data-creature');
        var indicator = document.querySelector('.progress [data-creature="' + creature + '"]');
        if (indicator) {
          if (!indicator.classList.contains('visited')) {
            if (window.audio) {
              audio.doneLoading(function () {
                audio.playCue('visit');
              });
            }
          }
          indicator.classList.add('visited');
        }

        // GA in-view
        ga('send', {
          hitType: 'event',
          eventCategory: 'In-view',
          eventAction: 'click',
          eventLabel: 'Enter challenge: ' + creature
        });
      },
      entered: function(direction) {
        // this.element.classList.add('viz-focus');
      },
      exit: function(direction) {
        // this.element.classList.remove('viz-focus');
      },
      exited: function(direction) {
      }
    });
  });

  // Toggle on the challenger tasks
  $(".segment").on("click", ".rediscover", function(){
    $(this).parents(".segment").toggleClass("completed");
  });

  // Things to do after the challenge is completed.
  var missionAccomplished = function(challenge) {
    $(challenge).find(".challenge").append('<p class="rediscover">Close</p>');
    challenge.removeEventListener('transitionend', missionAccomplished);
    challenge.classList.add('completed');
  };

  // Clicking prompt arrow scrolls to first frame
  $("#start").on("click", function(e){
      e.preventDefault();
      var section = $(this).attr('href');
      $('html, body').animate({
        scrollTop: $(section).offset().top
      }, 200);
    });

  // Progress bar icons scroll to appropriate depth
  $("#progress_bar").find("a").each(function(a){
    $(this).on("click", function(e){
      e.preventDefault();
      var section = $(this).attr('href');
      var newDepth = section.slice(2);
      var time = Math.round(Math.abs((newDepth - currentDepth)));
      $('html, body').animate({
        scrollTop: $(section).offset().top
      }, time);
    });
  });

  // Listen for anomoly link
  $("#dashboard").on("click", "a", function(e){
    if ($(this).parents(".alarm").length) {
      e.preventDefault();
      var section = $(this).attr('href');
      var newDepth = section.slice(2);
      var time = Math.round(Math.abs((newDepth - currentDepth)));
      closeDashboard();
      $('html, body').animate({
        scrollTop: $(section).offset().top
      }, time);
    }
  });

  // Debouncing on rezize
  // http://davidwalsh.name/javascript-debounce-function
  // If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.

  // call like so: window.addEventListener('resize', myEfficientFn);

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }


  // For accessing parents by selector:
  // http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
  function collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
  }
  function findParentBySelector(elm, selector) {
    var all = document.querySelectorAll(selector);
    var cur = elm.parentNode;
    while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
    }
    return cur; //will return null if not found
  }

  window.addEventListener('load', function () {
    GoalManager.init();
    setupAudio();
  });

  function setupAudio() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!window.AudioContext) return;
    window.context = new AudioContext();
    window.audio = new AudioManager();
    audio.mute();
    var isMuted = true;

    var activeZone = document.querySelector('.zone.in-view');
    var currentQuad = activeZone ? activeZone.getAttribute('data-audio') : null;
    onZoneChanged(function (zone) {
      currentQuad = zone.getAttribute('data-audio');
      audio.doneLoading(function () {
        if (!isMuted) {
          audio.setBg(currentQuad);
        }
      });
    });

    var sounds = [
      {name: 'quad1', url: 'audio/quad1.ogg'},
      {name: 'quad2', url: 'audio/quad2.ogg'},
      {name: 'quad3', url: 'audio/quad3.ogg'},
      {name: 'quad4', url: 'audio/quad4.ogg'},
      {name: 'discover', url: 'audio/discover.ogg'},
      {name: 'visit', url: 'audio/visit.ogg'}
    ];

    audio.addSounds(sounds, function () {
      var audioButton = document.querySelector('#audio-toggle');
      if (!isMuted) {
        audio.setBg(currentQuad);
      }
      audioButton.addEventListener('click', function () {
        isMuted = !isMuted;
        if (isMuted) {
          audio.mute();
        } else {
          audio.unmute();
          audio.setBg(currentQuad);
        }
      });
    });
  }

  // use only one timeout for style polling, when polling is necessary.
  var pollPolitely = (function () {
    var polls = [];

    function stop(fn) {
      for (var i=0; i<polls.length; i++) {
        if (polls[i] === fn) {
          polls.splice(i, 1);
          break;
        }
      }
    }

    function poll() {
      polls.forEach(function (fn) {
        fn(stop.bind(this, fn));
      });
      setTimeout(poll, 500);
    }

    setTimeout(poll, 500);

    return function (fn) {
      polls.push(fn);
    };
  })();



  GoalManager.addGoal({
    name: 'flashlight-fish',
    evaluate: function (complete) {
      var creature = document.querySelector('#creature_flashlight-fish1');
      function handler(e) {
        complete();
        creature.removeEventListener('animationiteration', handler);
      }
      creature.addEventListener('animationiteration', handler);
    },
    success: function () {
      var challenge = document.getElementById('d400');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      challenge.classList.add('completed');
      audio.playCue('discover');
      document.getElementById('challenge_flashlight-fish').classList.add('completed');
    }
  });

  GoalManager.addGoal({
    name: 'nautilus',
    evaluate: function (complete) {
      var creature = document.getElementById('creature_nautilus1');
      var $segment = $(creature).parents('.segment');
      pollPolitely(function (stop) {
        if (!$segment.hasClass('in-view')) {
          return;
        }
        var val = window.getComputedStyle(creature).getPropertyValue('animation-timing-function');
        // checking for negative values in a cubic bezier
        var hasNegative = val.search(/-\d/) >= 0;
        if (hasNegative) {
          stop();
          complete();
        }
      });
    },
    success: function () {
      var challenge = document.getElementById('d600');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      challenge.classList.add('completed');
      audio.playCue('discover');
      document.querySelector('#challenge_nautilus').classList.add('completed');
    }
  });


  GoalManager.addGoal({
    name: 'orange-roughy',
    evaluate: function (complete) {
      var creature = document.querySelector('#creature_orange-roughy1');
      var $segment = $(creature).parents('.segment');
      pollPolitely(function (stop) {
        if (!$segment.hasClass('in-view')) {
          return;
        }
        var val = window.getComputedStyle(creature).getPropertyValue('filter');
        // checking for negative values in a cubic bezier
        if (val.indexOf('/img/blue-filter.svg#seafish') < 0) {
          stop();
          complete();
        }
      });
    },
    success: function () {
      var challenge = document.getElementById('d1600');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      challenge.classList.add('completed');
      $('.orange-roughy-revelation').removeClass('orange-roughy-revelation');
      document.querySelector('#challenge_orange-roughy').classList.add('completed');
      audio.playCue('discover');
    }
  });


  GoalManager.addGoal({
    name: 'disco-time',
    evaluate: function (complete) {
      var creature = document.querySelector('#creature_dragonfish1 .lumi path');
      var $segment = $(creature).parents('.segment');
      pollPolitely(function (stop) {
        if (!$segment.hasClass('in-view')) {
          return;
        }
        var val = window.getComputedStyle(creature).getPropertyValue('color');
        if (val === 'rgb(86, 253, 219)') {
          stop();
          complete();
        }
      });
    },
    success: function () {
      var challenge = document.getElementById('d2600');
      challenge.classList.add('completed');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      document.querySelector('#challenge_anglerfish').classList.add('completed');
      audio.playCue('discover');
    }
  });


  GoalManager.addGoal({
    name: 'shrimp',
    evaluate: function (complete) {
      var creature = document.querySelector('#creature_vomiting-shrimp1');
      var $segment = $(creature).parents('.segment')[0];

      var dangerzone = false;
      creature.addEventListener('animationstart', function () {
        dangerzone = true;
        setTimeout(function () {
          dangerzone = false;
        }, 1000);
      });

      pollPolitely(function (stop) {
        if (!$segment.classList.contains('in-view')) {
          return;
        }
        if (dangerzone) {
          return;
        }
        var style = window.getComputedStyle(creature);
        var val = style.getPropertyValue('transform');

        if (val === 'none') {
          stop();
          complete();
        }
      });

    },
    success: function () {
      var challenge = document.getElementById('d5000');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      audio.playCue('discover');
      document.querySelector('#challenge_vomiting-shrimp').classList.add('completed');
    }
  });

  GoalManager.addGoal({
    name: 'hagfish',
    evaluate: function (complete) {
      var creature = document.getElementById('creature_hagfish1');
      var $segment = $(creature).parents('.segment');
      pollPolitely(function (stop) {
        if (!$segment.hasClass('in-view')) {
          return;
        }
        var val = window.getComputedStyle(creature).getPropertyValue('bottom');
        // checking for negative values in a cubic bezier
        if (parseInt(val) > 100) {
          stop();
          complete();
        }
      });
    },
    success: function () {
      var challenge = document.getElementById('d6000');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      audio.playCue('discover');
      document.querySelector('#challenge_hagfish').classList.add('completed');
    }
  });


  GoalManager.addGoal({
    name: 'squid',
    evaluate: function (complete) {
      var creature1 = document.querySelector('#creature_humboldt-squid1');
      var creature2 = document.querySelector('#creature_humboldt-squid2');

      var segment = $(creature1).parents('.segment');

      var count1 = 0;
      var count2 = 0;
      var ocount1 = 0;
      var ocount2 = 0;

      function cleanup() {
        creature1.removeEventListener('animationiteration', increment1);
        creature2.removeEventListener('animationiteration', increment2);
      }

      pollPolitely(function (stop) {
        if (!segment.hasClass('in-view')) {
          return;
        }
        if (count1 > 0 && count2 > 0 &&
            count1 !== count2 &&
            (ocount1 === count1 || ocount2 === count2)
           ) {
          stop();
          cleanup();
          complete();
        }
        ocount1 = count1;
        ocount2 = count2;
      });

      function increment1 (e) {
        if (e.animationName === 'excited') {
          count1++;
        }
      }

      function increment2 (e) {
        if (e.animationName === 'excited') {
          count2++;
        }
      }

      creature1.addEventListener('animationiteration', increment1);
      creature2.addEventListener('animationiteration', increment2);
    },
    success: function () {
      var challenge = document.getElementById('d800');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      challenge.classList.add('completed');
      audio.playCue('discover');
      document.querySelector('#challenge_humboldt-squid').classList.add('completed');
    }
  });

  // GoalManager.addGoal({
  //   name: 'jellyfish',
  //   evaluate: function (complete) {
  //     var creature = document.querySelector('#creature_alarm-jellyfish1');
  //
  //     pollPolitely(function (stop) {
  //       var style = getComputedStyle(creature);
  //       var fill = style.getPropertyValue('fill');
  //       var color = style.getPropertyValue('color');
  //       if (fill === 'rgb(0, 0, 0)', color !== 'transparent') {
  //         stop();
  //         complete();
  //       }
  //     });
  //   },
  //   success: function () {
  //     var challenge = document.getElementById('d4400');
  //     challenge.addEventListener('transitionend', missionAccomplished(challenge));
  //     audio.playCue('discover');
  //     document.querySelector('#challenge_alarm-jellyfish').classList.add('completed');
  //     // GA complete
  //     ga('send', {
  //       hitType: 'event',
  //       eventCategory: 'Complete',
  //       eventAction: 'click',
  //       eventLabel: 'Completed alarm jellyfish'
  //     });
  //   }
  // });

  (function () {
    var docEl = document.documentElement;
    var docHeight = docEl.scrollHeight;
    var winHeight = window.innerHeight;
    var currentPosition = getScrollTop();
    var pos;

    function getScrollTop() {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }

    var offsetReference = document.querySelector('.wrapper');
    var currentOffset = currentPosition - offsetReference.offsetTop;

    var calcRequest;
    window.addEventListener('scroll', function (e) {
      currentPosition = getScrollTop();
      currentOffset = currentPosition - offsetReference.offsetTop;
      clearTimeout(calcRequest);
      calcRequest = setTimeout(findPuzzlePosition, 100);
    });

    function occlusion(top1, height1, top2, height2) {
      var bottom1 = top1 + height1;
      var bottom2 = top2 + height2;
      if (top1 < top2 && bottom2 < bottom1) { // 1--2--2--1
        return height1 - height2;
      }
      if (top2 < top1 && bottom1 < bottom2) { // 2--1--1--2
        return height1;
      }
      if (top1 < top2 && top2 < bottom1 && bottom1 < bottom2) { // 1--2--1--2
        return bottom1 - top2;
      }
      if (top2 < top1 && top1 < bottom2 && bottom2 < bottom1) { // 2--1--2--1
        return bottom2 - top1;
      }
      return 0;
    }

    pollPolitely(findPuzzlePosition);

    findPuzzlePosition();

    function findPuzzlePosition() {
      var mostOccluding;
      var maxOcclusion = 0;
      currentPosition = getScrollTop();
      for (var i=0; i<segments.length; i++) {
        var segment = segments[i];
        if (segment.classList.contains('in-view')) {
          var occ = occlusion(currentPosition, winHeight, segment.offsetTop, segment.offsetHeight);
          if (occ > maxOcclusion) {
            maxOcclusion = occ;
            mostOccluding = segment;
          }
        }
      }
      if (mostOccluding) {
        offsetReference = mostOccluding;
        currentOffset = currentPosition - offsetReference.offsetTop;
      } else {
        setTimeout(findPuzzlePosition, 500);
      }
    }

    window.addEventListener('load', function (e) {
      currentPosition = getScrollTop();
      docHeight = docEl.scrollHeight;
      winHeight = window.innerHeight;
      findPuzzlePosition();

      window.addEventListener('resize', function (e) {
        winHeight = window.innerHeight;
        docHeight = docEl.scrollHeight;
        document.documentElement.scrollTop = document.body.scrollTop = offsetReference.offsetTop + currentOffset;

        if (dashboardOpen) {
          moveDashboard($("#dashboard").find(".in-focus"));
        }
      });
    });
  })();

})();
var dashboardOpen = false;
// opening and closing panels in the dashboard
// track open or closed

function setDashboardHeight(panel, offset) {
  var $dashBoardHeight = $("#menu_options").get(0).offsetHeight + panel.get(0).offsetHeight;
  if (offset) {
    $("#control-panel").css({ transform: 'translateY(calc(100% - ' + $dashBoardHeight + 'px + ' + offset + '))'});
  } else {
    $("#control-panel").css({ transform: 'translateY(calc(100% - ' + $dashBoardHeight + 'px))'});
  }
}

function moveDashboard(panel) {
  dashboardOpen = true;
  setDashboardHeight(panel);
  $("html").addClass("dashOpen");
};
