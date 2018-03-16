'use strict';

//fadeIn body when the page is loaded
$(document).ready(() => {
  $('body').css('opacity', 1);
})

//position the playList on the home page
setTimeout(() => {
  $('.track[data="5"]').addClass('selectedSong');
  const songIconOffset = $('#sound').offset().top;
  const position = $('.selectedSong').offset().top;
  const scrollSongTo = position - songIconOffset;
  document.getElementById('playlistSectionHolder').scrollTop = scrollSongTo;
}, 100);

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', '$timeout', 'animation', 'task', 'data', function($rootScope, $scope, $interval, $timeout, animation, task, data){
  //second the song plays (help calculate the progression bar)
  $rootScope.musicFinishTime = 269;
  //used to calculate the progression bar length on the home page
  $rootScope.musicCurrentTime = 0;
  //used to calculate the progression bar length on the home page
  $rootScope.playingPercent = 0;
  //the length of the song progression bar on the home page
  $rootScope.playingBarWidth = '0em';
  //track if the song is playing
  $rootScope.playMusic = false;
  //the default img that is displayed on the home page
  $rootScope.featureImg = './img/featureImg.png';
  //current page
  $rootScope.currentPage = 'home';
  //underlines the specified page in the naigation with the active class
  $scope.nav = { home: 'active', about: '', artist: '', staff: '', contact: '' };
  $scope.toggleMusic = () => {
    //restart song if at the end of the song
    ($rootScope.musicCurrentTime === $rootScope.musicFinishTime) ? $rootScope.musicCurrentTime = 0 : null;
    //toggle the play btn
    $rootScope.playMusic = !$rootScope.playMusic;
    ($rootScope.playMusic) ? $rootScope.audio1.play() : $rootScope.audio1.pause();
    //start the play bar progression
    ($scope.playMusic) ? animation.playMusic() : animation.pauseMusic();
  }
  //access the data for the home page
  $scope.playList = data.playList;
  //set the initial song
  task.setMusic($scope.playList[6]);
  //triggered by when selecting to song from the home page
  $scope.playSong = (data) => {
    ($rootScope.playMusic) ? $scope.toggleMusic() : null;
    task.setMusic($scope.playList[data]);
    $scope.toggleMusic();
    task.scrollSongInPlace(data);
  }
  //navigate website
  $scope.navigateTo = (page) => {
    //return null if already on page
    if(page === $rootScope.currentPage){ return null }
    //hide the navigation until done transitioning pages
    $('#navigation').fadeOut(500);
    //clear the active page underline from all navigation options
    $scope.nav = { home: '', about: '', artist: '', staff: '', contact: '' };
    //add the active underline to the clicked on navigation
    $scope.nav[page] = 'active';
    //transition from the current page
    animation.navigationFrom(data.navigationAnimations[$rootScope.currentPage]);
    //transition to the next page
    animation.navigationTo(page, data.navigationAnimations[page]);
  }
  task.hidePages();

  //slideshow methods
  $scope.items = data.items;
  $scope.moveSlider = (index) => {
    task.slideItem(index);
  }
  $timeout(() => {
    task.preScrollSlider();
  })
  task.setArtistImgs(data.items);
}]);

app.service('animation', function($rootScope, $interval, $timeout, data, task){
  //used as the interval when calculating the progression bar on the home page
  this.playing;
  //continue the progression bar and play music on the home page
  this.playMusic = () => {
    $rootScope.musicCurrentTime++;
    task.playingPercent();
    $timeout(() => {
      task.resizeTimer();
    }, 200)
    this.playing = $interval(() => {
      $rootScope.musicCurrentTime++;
      task.playingPercent();
      task.resizeTimer();
      if($rootScope.musicCurrentTime === $rootScope.musicFinishTime){
        this.pauseMusic();
      }
    }, 1000);
  }
  //pause the progression bar and pause music on the home page
  this.pauseMusic = () => {
    $interval.cancel(this.playing);
    $rootScope.playMusic = false;
  }
  this.navigationFrom = (animationObj) => {
    animationObj.map((animation) => {
      const $selector = $(animation['selector']);
      const animationClass = animation['animation'];
      $selector.addClass(animationClass);
    })
  }
  this.navigationTo = (selector, animationObj) => {
    const selected = "#" + selector + 'Page';
    const currentPage = "#" + $rootScope.currentPage + 'Page';

    $timeout(() => {
      $(currentPage).addClass('none');
      $(selected).addClass('transitioning').removeClass('none');
      animationObj.map((animation) => {
        const $selector = $(animation['selector']);
        const animationClass = animation['animation'];
        $selector.addClass(animationClass);
      })

      $(selected).removeClass('transitioning');

      $rootScope.currentPage = selector;
      $timeout(() => {
        animationObj.map((animation) => {
          const $selector = $(animation['selector']);
          const animationClass = animation['animation'];
          $selector.removeClass(animationClass);
          $('#navigation').fadeIn(500);
        })
      }, 100)
    }, 800)
  }
});

app.service('data', function(){
  this.playList = [
    {
      artist: 'Will Amaze',
      track: 'Will Amaze - Do It',
      songLocation: './music/Will Amaze - Do It.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 230,
    },
    {
      artist: 'ed sheeran',
      track: 'Will Amaze - Shooting Star',
      songLocation: './music/Will Amaze - Shooting Star.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    },
    {
      artist: 'ed sheeran',
      track: '3 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    },
    {
      artist: 'ed sheeran',
      track: '4 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    },
    {
      artist: 'ed sheeran',
      track: '5 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    },
    {
      artist: 'ed sheeran',
      track: '6 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    },
    {
      artist: 'ed sheeran',
      track: '7 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    },
    {
      artist: 'ed sheeran',
      track: '8 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    }
  ];
  this.navigationAnimations = {
    home: [
      { selector: '#homePageLargeTextP.homePageLargeTextP', animation: 'fadeLeft'},
      { selector: '#featuredArtist', animation: 'left'},
      { selector: '#homePage', animation: 'fade'}
    ],
    about: [
      { selector: '#aboutScreen.aboutScreen', animation: 'top'},
      { selector: '#aboutImg.aboutImg', animation: 'right'},
      { selector: '#aboutPage', animation: 'fade'}
    ],
    artist: [
      { selector: '#leftArtistImg', animation: 'artistLeft'},
      { selector: '#rightArtistImg', animation: 'artistRight'},
      { selector: '#artistPage', animation: 'fade'}
    ],
    staff: [
      { selector: '#staffPageTopBottom', animation: 'topStaffPage'},
      { selector: '#staffPage', animation: 'fade'}
    ],
    contact: []
  }
  this.items = [
    {name: '', img: ''},
    {name: 'one', img: './img/artist.png'},
    {name: 'two', img: './img/artist.png'},
    {name: 'three', img: './img/artist.png'},
    {name: 'four', img: './img/artist.png'},
    {name: 'five', img: './img/artist.png'},
    {name: 'six', img: './img/artist.png'},
    {name: 'seven', img: './img/artist.png'},
    {name: 'eight', img: './img/artist.png'},
    {name: 'nine', img: './img/artist.png'},
    {name: 'ten', img: './img/artist.png'},
    {name: '', img: ''}
  ]
});

//task service
app.service('task', function($rootScope, $interval, $timeout){
  //calculate the percentage of music that is played on the home page
  this.playingPercent = () => {
    $rootScope.playingPercent = $rootScope.musicCurrentTime/$rootScope.musicFinishTime;
  }
  //lengthens the progression bar on the home page as the music plays
  this.resizeTimer = () => {
    const fullWidth = 8.8;
    $rootScope.playingBarWidth = fullWidth * $rootScope.playingPercent + 'em';
  }
  //sets the music to be played on the homepage
  this.setMusic = (playList) => {
    $rootScope.musicCurrentTime = 0;
    $rootScope.playingPercent = 0;
    $rootScope.musicFinishTime = playList['secondsInSong'];
    $rootScope.audio1 = '';
    $rootScope.audio1 = new Audio(playList['songLocation']);
  }
  //scroll to the selected song on the home page
  this.scrollSongInPlace = (data) => {
    document.getElementById('playlistSectionHolder').scrollTop = 0;
    $('.track').removeClass('selectedSong');
    $('.track[data="' + data + '"]').addClass('selectedSong');
    const songIconOffset = $('#sound').offset().top;
    const position = $('.selectedSong').offset().top;
    const scrollSongTo = position - songIconOffset;
    document.getElementById('playlistSectionHolder').scrollTop = scrollSongTo;
  }
  //hide all page except the homepage
  this.hidePages = () => {
    $('#aboutPage').addClass('none');
    $('#artistPage').addClass('none');
    $('#staffPage').addClass('none');
  }
  ////////slider methods
  this.preScrollSlider = () => {
    this.slideItem(1);
  }
  this.slideItem = (index) => {
    //remove the selected class from all sildes
    $('.slideItems').removeClass('selectedSlide');
    //add the slider class to target
    $('.slideItems[data="' + index + '"]').addClass('selectedSlide');
    //with of the slider item
    const itemContainerWidth = $('.slideItems').width();
    //th position to slide the parent element
    const slidePosition = (itemContainerWidth * (index - 1));
    //animate slider
    $('#slideShowContainer').animate({ scrollLeft: slidePosition }, 500);
    //scroll to the initial position without animation
    //document.getElementById('slideShowContainer').scrollLeft = (itemContainerWidth * (index - 1));
  }
  ////////end: slider methods
  this.setArtistImgs = (items) => {
    $timeout(() => {
      items.map((data, index) => {
        const test = $('.slideItems[data="' + index + '"]');
        $('.slideItems[data="' + index + '"]').css('backgroundImage', "url('" + data.img + "')");
      }, 1000)
    })
  }
});
