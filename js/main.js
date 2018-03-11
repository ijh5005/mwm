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
    $scope.nav = { home: '', about: '', artist: '', staff: '', contact: '' };
    $scope.nav[page] = 'active';
  }
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
});

app.service('data', function(){
  this.playList = [
    {
      artist: 'ed sheeran',
      track: '1 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
      imgLocation: './img/featureImg.png',
      secondsInSong: 269,
    },
    {
      artist: 'ed sheeran',
      track: '2 perfect by ed sheeran',
      songLocation: './music/audio1.mp3',
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
});
