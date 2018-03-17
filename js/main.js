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
  //navigation options
  $rootScope.navigationOptions = data.navigationOptions;
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
  $scope.navigateTo = (page, hasInitiallyLoaded) => {
    //return null if already on page
    if((page === $rootScope.currentPage) && !hasInitiallyLoaded){ return null }
    //fade the logo opacity on different pages for contrast
    const opacity = ((page === 'artist') || (page === 'services') || (page === 'contact')) ? 0 : 0.1;
    $('#logo img').css('opacity', opacity);
    //hide the navigation until done transitioning pages
    $('#navigation').fadeOut(500);
    //transition from the current page
    animation.navigationFrom(data.navigationAnimations[$rootScope.currentPage]);
    //transition to the next page
    animation.navigationTo(page, data.navigationAnimations[page]);
    //set artist to default if going to artist page
    if(page === 'artist'){
      $timeout(() => { $scope.moveSlider(6); }, 1000)
    }
    //wait for page to refresh to add the active class to the navigation page
    $timeout(() => {
      //clear the active page class from all navigation options
      $('.navigationOption').removeClass('active');
      //current page index
      const index = task.findIndexOfPageByName(page, data.navigationOptions);
      //add the active underline to the clicked on navigation
      $('.navigationOption[data="' + index + '"]').addClass('active');
    })
  }
  task.hidePages(data.navigationOptions);
  //services
  $scope.services = data.services;
  //slideshow methods
  $scope.artists = data.artists;
  $scope.currentArtist = data.artists[6];
  $scope.moveSlider = (index) => {
    $scope.currentArtist = data.artists[index];
    task.slideItem(index);
  }
  $timeout(() => {
    const hasInitiallyLoaded = true;
    $scope.navigateTo('home', hasInitiallyLoaded);
    task.preScrollSlider();
    $('#navigation').removeClass('none');
  })
  task.setArtistImgs(data.artists);
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
        })
        $('#navigation').fadeIn(500);
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
    services: [
      { selector: '#servicesPageLeftSide.servicesPageLeftSide', animation: 'fade'},
      { selector: '#servicesPageRightSide.servicesPageRightSide', animation: 'fade'}
    ],
    contact: [
      { selector: '#contactPageLeftSide.contactPageLeftSide', animation: 'fade'},
      { selector: '#contactPageRightSide.contactPageRightSide', animation: 'fade'}
    ]
  }
  this.artists = [
    {
      sign: '<<',
      name: '',
      img: '',
      bio: ''
    },
    {
      name: 'Leon "Pop Traxx" Huff, Jr.',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'BahBean',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'Hydro-Vig',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'TyKeeL',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'YQ DreaMs',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'Will AmaZe',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'Quad-S',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'June Diamond',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      name: 'Nae\' Ahmi',
      img: './img/artist.png',
      bio: 'Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und.'
    },
    {
      sign: '>>',
      name: '',
      img: ''
    }
  ]
  this.navigationOptions = [
    {index: 0, selector: '#homePage', name: 'HOME'},
    {index: 1, selector: '#aboutPage', name: 'ABOUT'},
    {index: 2, selector: '#artistPage', name: 'ARTIST'},
    {index: 3, selector: '#servicesPage', name: 'SERVICES'},
    {index: 4, selector: '#contactPage', name: 'CONTACT'}
  ]
  this.services = [
    'Consulting',
    'Studio Time',
    'Post to Final Production',
    'Publishing (Publish & Collect  Royalties for artist)',
    'Original Music production'
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
  this.hidePages = (navigationOptions) => {
    navigationOptions.map((data, index) => {
      if(index > 0){
        $(data.selector).addClass('none');
      }
    })
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
  this.findIndexOfPageByName = (page, navigationOptions) => {
    let index = null;
    navigationOptions.map((data) => {
      if(data.name.toLowerCase() === page){
        index = data.index;
      }
    })
    return index;
  }
});
