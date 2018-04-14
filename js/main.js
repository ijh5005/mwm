'use strict';

//fadeIn body when the page is loaded
$(document).ready(() => {
  $('body').css('opacity', 1);
});

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
  $rootScope.featureImg = '';
  //current page
  $rootScope.currentPage = 'home';
  //navigation options
  $rootScope.navigationOptions = data.navigationOptions;

  //inline styling
  $rootScope.homePageLargeTextPStyle = '';
  $rootScope.featuredArtistStyle = '';
  $rootScope.homePageStyle = '';
  $rootScope.aboutScreenStyle = '';
  $rootScope.aboutImgStyle = '';
  $rootScope.aboutPageStyle = '';
  $rootScope.artistPageStyl = '';
  $rootScope.servicesPageStyle = '';
  $rootScope.servicesPageLeftSideStyle = '';
  $rootScope.servicesPageRightSideStyle = '';
  $rootScope.contactPageStyle = '';
  $rootScope.contactPageLeftSideStyle = '';
  $rootScope.contactPageRightSideStyle = '';

  $scope.currentArtistIndex = '';

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
  $rootScope.playList = data.playList;

  //set the initial song
  $timeout(() => {
    const songIndex = 5;
    task.setMusic($rootScope.playList[songIndex], songIndex);
    task.scrollSongInPlace(songIndex);
  }, 1000)

  //triggered by when selecting to song from the home page
  $scope.playSong = (data) => {
    ($rootScope.playMusic) ? $scope.toggleMusic() : null;
    task.setMusic($rootScope.playList[data], data);
    $scope.toggleMusic();
    task.scrollSongInPlace(data);
  }
  //navigate website
  $scope.navigateTo = (page, hasInitiallyLoaded) => {
    //return null if already on page
    if((page === $rootScope.currentPage) && !hasInitiallyLoaded){ return null }
    //hide homePage while transitioning if initially loaded
    if(hasInitiallyLoaded){
      $timeout(() => {
        $('#homePage').removeClass('fade');
      }, 500)
    }

    //fade the logo opacity on different pages for contrast
    // const opacity = ((page === 'artist') || (page === 'services') || (page === 'contact')) ? 0 : 0.1;
    // $('#logo img').css('opacity', opacity);

    //hide the navigation until done transitioning pages
    $('#navigation').fadeOut(500);

    //transition from the current page
    animation.navigationFrom(data.navigationAnimations[$rootScope.currentPage]);
    //transition to the next page
    animation.navigationTo(page, data.navigationAnimations[page]);

    //set artist to default if going to artist page
    if(page === 'artist'){
      //the index of the artist to show when initially going to the artist page
      const indexOfArtistToShowFirst = 6;
      $timeout(() => { $scope.moveSlider(indexOfArtistToShowFirst); }, 1000)
    }

    //wait for page to refresh to add the active class to the navigation page
    $timeout(() => {
      //clear the active page class from all navigation options
      $('.navigationOption').removeClass('active');
      //current page index
      const index = task.findIndexOfPageByName(page, data.navigationOptions);
      //add the active class to the clicked navigation option
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
    $scope.currentArtistIndex = index;
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
      const $rootScopeSelector = animation['$rootScopeSelector'];
      $rootScope[$rootScopeSelector] = animation['animation'];
    })
  }
  this.navigationTo = (selector, animationObj) => {
    const selected = "#" + selector + 'Page';
    const currentPage = "#" + $rootScope.currentPage + 'Page';

    $timeout(() => {
      $(currentPage).addClass('none');
      $(selected).addClass('transitioning').removeClass('none');
      animationObj.map((animation) => {
        const $rootScopeSelector = animation['$rootScopeSelector'];
        $rootScope[$rootScopeSelector] = animation['animation'];
      })

      $(selected).removeClass('transitioning');

      $rootScope.currentPage = selector;
      $timeout(() => {
        animationObj.map((animation) => {
          const $rootScopeSelector = animation['$rootScopeSelector'];
          $rootScope[$rootScopeSelector] = '';
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
      track: 'Will Amaze - Shooting Star',
      songLocation: './music/Will Amaze - Shooting Star.mp3',
      imgLocation: './img/artistFeature/WillAmaze.png',
      secondsInSong: 269,
    },
    {
      artist: 'Will Amaze',
      track: 'Will Amaze - Do It',
      songLocation: './music/Will Amaze - Do It.mp3',
      imgLocation: './img/artistFeature/WillAmaze.png',
      secondsInSong: 230,
    },
    {
      artist: 'TyKeeL',
      track: 'Young Ty - Pop Star_1',
      songLocation: './music/Young Ty - Pop Star_1.mp3',
      imgLocation: './img/artistFeature/TyKeel.png',
      secondsInSong: 171,
    },
    {
      artist: 'TyKeeL',
      track: 'Young Ty - Luke Cage',
      songLocation: './music/Pep Ty Luke Cage(Master).mp3',
      imgLocation: './img/artistFeature/TyKeel.png',
      secondsInSong: 216,
    },
    {
      artist: 'Bahbean',
      track: 'Bahbean - Magic clean',
      songLocation: './music/Bahbean - Magic clean.mp3',
      imgLocation: './img/artistFeature/bb.png',
      secondsInSong: 206,
    },
    {
      artist: 'Nae\' Ahmi',
      track: 'Nae\' Ahmi - Nae Creepin',
      songLocation: './music/Nae Creepin (Master).mp3',
      imgLocation: './img/artistFeature/Nae.png',
      secondsInSong: 226,
    },
    {
      artist: 'TyKeeL',
      track: 'Young Ty - Monstar',
      songLocation: './music/Young Ty - Monstar.mp3',
      imgLocation: './img/artistFeature/TyKeel.png',
      secondsInSong: 143,
    },
    {
      artist: 'KMCB',
      track: 'KMCB - Shining',
      songLocation: './music/KMCB Shining(Master).mp3',
      imgLocation: './img/artistFeature/MistaCashmere.png',
      secondsInSong: 228,
    },
    {
      artist: 'Pep Yq & Nae',
      track: 'Pep Yq & Nae - They Changin',
      songLocation: './music/Pep Yq & Nae (They Changin)(MASTER).mp3',
      imgLocation: './img/artistFeature/YQDreaMs.png',
      secondsInSong: 269,
    },

  ];
  this.navigationAnimations = {
    home: [
      { $rootScopeSelector: 'homePageLargeTextPStyle', animation: 'position: relative;transition: opacity 0.5s, left 1s;opacity: 0;left: 100%;'},
      { $rootScopeSelector: 'featuredArtistStyle', animation: 'left: -40em;transition: left 0.5s;'},
      { $rootScopeSelector: 'homePageStyle', animation: 'opacity: 0;transition: opacity 0.5s;'}
    ],
    about: [
      { $rootScopeSelector: 'aboutScreenStyle', animation: 'top: -20rem;transition: top 1s;'},
      { $rootScopeSelector: 'aboutImgStyle', animation: 'right: -40em;transition: right 0.5s;'},
      { $rootScopeSelector: 'aboutPageStyle', animation: 'opacity: 0;transition: opacity 0.5s;'}
    ],
    artist: [
      { $rootScopeSelector: 'artistPageStyle', animation: 'opacity: 0;transition: opacity 0.5s;'}
    ],
    services: [
      { $rootScopeSelector: 'servicesPageStyle', animation: 'opacity: 0;transition: opacity 0.5s;'},
      { $rootScopeSelector: 'servicesPageLeftSideStyle', animation: 'top: 20rem;transition: top 1s;'},
      { $rootScopeSelector: 'servicesPageRightSideStyle', animation: 'opacity: 0;transition: opacity 0.5s;'}
    ],
    contact: [
      { $rootScopeSelector: 'contactPageStyle', animation: 'opacity: 0;transition: opacity 0.5s;'},
      { $rootScopeSelector: 'contactPageLeftSideStyle', animation: 'opacity: 0;transition: opacity 0.5s;'},
      { $rootScopeSelector: 'contactPageRightSideStyle', animation: 'top: 20rem;transition: top 1s;'}
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
      name: 'TyKeeL',
      img: './img/artistBio/TyKeeL.png',
      bio: 'Young Ty, aka “TyKeel” is a 13 year old rapper blazing out of Philadelphia and going toe to toe with some of the best. He has been rapping since conception and now he is launching his professional career with Mighty Works Media Music Group, LLC. His new single is “Luke Kage.”'
    },
    {
      name: 'YQ DreaMs',
      img: './img/artistBio/YQDreaMs.png',
      bio: 'YQ Dreams, aka “Young Quan” is a rising Hip-Hop Rap Artist with a large following in New Jersey and Philadelphia. YQ has collaborated with producers such as ImASaynt and CMPLX. YQ is taking his career to the next level by working with Mighty Works Media Music Group, LLC. His new single is “Changing” featuring the lovely songbird, Nae’Ahmi.'
    },
    {
      name: 'Mista Cashmere',
      img: './img/artistBio/MistaCashmere.png',
      bio: '( KMCB ) Also known as ( Mista Cashmere ) but his birth name is ( Kwamane R. Harrison ) Started rapping at the age of 7 years old. Born out of North Philadelphia, Kensington Area, he grew to become a Hip Hop Rap Artist that was influenced by his hard life surroundings, he developed a talent that shocked his friends and family members. So he decided to take it to the next level and become what he and everyone around him believed he would be. A Rap Star. Still, to this day, he follows his dreams and won’t give up until he reaches his goals. Just newly signed to Mighty Works Media LLC,  he believes this can be his chance at greatness.'
    },
    {
      name: 'Quad-S',
      img: './img/artistBio/QuadS.png',
      bio: 'Quads is really a triple threat, he can sing, dance and rap.  He is well known in New Jersey with an increasing following from Philadelphia.  Quads started his musical career performing with his brother Zey who is also a NO Baggage Records artist.'
    },
    {
      name: 'Will AmaZe',
      img: './img/artistBio/WillAmaze.png',
      bio: 'Will Amaze is a seasoned Kingdom Rap Artist and he is leveling up his career with Mighty Works Media Music Group, LLC. He is truly an AMAZING artist with remarkable word play and inspirational lyrics (always with a profound message). His new single is “Do It.”'
    },
    {
      name: 'Nae\' Ahmi',
      img: './img/artistBio/Nae.png',
      bio: 'Nae’Ahmi is a young ascending star with an angel like voice spiced with an edgy hypnotic sound. She started her career singing in church and now she is launching her professional career with Mighty Works Media Music Group, LLC. Her new single is “Creeping.”'
    },
    {
      name: 'Zey',
      img: './img/artistBio/Zey.png',
      bio: 'Zey is a transcendent Rap and R&B Artist with a native flare to his music. He also produces hypnotic beats and paints a Rembrandt with his prolific lyrics.  Zey started his career performing with his brother Quads, who is also a NO Baggage Records.'
    },
    {
      name: 'BahBean',
      img: './img/artistBio/bb.png',
      bio: 'Bahbean is a conscious lyrical Rap Artist and widely known throughout the tristate area of New Jersey, Pennsylvania, Delaware, and worldwide. Bahbean’s musical style is influenced mostly from his hardships and obstacles in life. He was one of the first Artists signed to Mighty Works Media Music Group, LLC. His new single is “Magic.”'
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
  this.setMusic = (playList, data) => {
    $rootScope.featureImg = $rootScope.playList[data]['imgLocation'];
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
