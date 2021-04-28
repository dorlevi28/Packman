var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var pause_time;
var tempTime;
var time_elapsed;
var interval;
let foodAmount = 60;
let totalFood;
let NumberOfdLives = 5;
var timeForGame = 60; //change
var ghosts_interval;
var special_food_interval;
var special_heart_interval;

class ball {
  constructor(Precentage, color, points, sizeInPixels) {
    this.Precentage = Precentage;
    this.color = color;
    this.points = points;
    this.sizeInPixels = sizeInPixels;
  }
}

$(document).ready(function () {
  // this happens when the DOM is ready and all the elements has been saved and loaded
  // add default user "k" with password k
  localStorage.setItem('k', 'k'); //ideal for username and passwords

  //REGISTER
  $('#registration_form_label').validate({
    rules: {
      registration_username: {
        required: true,
      },
      registration_password: {
        required: true,
        minlength: 6,
      },
      registration_fullname: {
        required: true,
        lettersonly: true,
      },
      registration_email: {
        required: true,
        email: true,
      },
      registration_birthday: {
        required: true,
      },
    },
    messages: {
      registration_username: {
        required: 'User Name is Mandatory',
      },
      registration_password: {
        strongPassword: 'Youre password must contain at least 6 charcters',
        required: 'Password is Mandatory',
      },
      registration_fullname: {
        required: 'Full Name is Mandatory',
        lettersonly: 'Name must be made only from letters',
      },
      registration_email: {
        required: 'Mail is mandatory',
        email: 'Email not valid',
      },
      registration_birthday: {
        required: 'Date of birth s mandatory',
      },
    },
    submitHandler: function () {
      registration_func();
      $('#registration_form_label')[0].reset();
    },
  });

  //LOGIN
  $('#login_form_label').validate({
    rules: {
      login_username: {
        required: true,
      },
      login_password: {
        required: true,
      },
    },
    messages: {
      login_username: {
        required: 'User Name is Mandatory',
      },
      login_password: {
        required: 'Password is Mandatory',
      },
    },
    submitHandler: function () {
      login_func();
      $('#login_form_label')[0].reset();
    },
  });

  //Configuations
  $('#form_configuration_id').validate({
    rules: {
      configuration_set_up_name: {
        required: true,
      },
      configuration_set_down_name: {
        required: true,
        notEqualTo: '#up',
      },
      configuration_set_left_name: {
        required: true,
        notEqualTo: '#up',
        notEqualTo: '#down',
      },
      configuration_set_right_name: {
        required: true,
        notEqualTo: '#up',
        notEqualTo: '#down',
        notEqualTo: '#left',
      },
      configuration_set_duration_name: {
        required: true,
        greaterOrEqual: 60,
      },
      configuration_monster_amount:{
      required:true,
    }

  },
    messages: {
      configuration_set_up_name: {
        required: 'enter up key',
        notEqualTo: 'This key already taken by another action.',
      },
      configuration_set_down_name: {
        required: 'enter down key',
        notEqualTo: 'This key already taken by another action.',
      },
      configuration_set_left_name: {
        required: 'enter left key',
        notEqualTo: 'This key already taken by another action.',
      },
      configuration_set_right_name: {
        required: 'enter right key',
        notEqualTo: 'This key already taken by another action.',
      },
      configuration_set_duration_name: {
        required: 'enter game time',
        greaterOrEqual: 'Minimum game duration is 60 second.',
      },
      configuration_monster_amount:{
        required:"Please enter num of monsters",
      }
    },
    submitHandler: function () {
      // changeNavBar("game");
      // Start();
      // console.log("hey")
      // $('#settings').hide();
      // $('#settings').hide();
      
      initGame();

    },
  });
});


const changeNavBar = (nav) => {

  if(nav.localeCompare('about')==0){
    showDialogFunc();
  }
  else{
    hide();
  $('#' + nav).show();
  }
  
};

const hide = () => {
  $('#GameBox').hide();
  $('#welcome_menu').hide();
  $('#register_container_id').hide();
  $('#login-container-id').hide();
  $('#settings').hide();
  // $('#game').hide();
  $('#about').hide();

  stopGame();
};

const show_regiester = () => {
  $('#login-container-id').hide();
  $('#welcome_menu').hide();

  //   $('#show_Login_a').hide();
  $('#register_container_id').show();
};

const show_login = () => {
  $('#register_container_id').hide();
  $('#welcome_menu').hide();

  //   $('#registration_form_label').hide();
  $('#login-container-id').show();
};
const registration_func = () => {
  stopMusicSound();
  let userName = document.getElementById('r_username_id').value;
  let password = document.getElementById('r_password_id').value;
  let fullName = document.getElementById('r_fullname_id').value;
  let email = document.getElementById('r_email_id').value;
  let birthday = document.getElementById('r_birthday_id').value;

  localStorage.setItem(userName, password);
  alert('you have been registered succesfully');
  show_login();
  //go to menu here
  //menu()
};

const login_func = () => {
  stopMusicSound();
  let userName = document.getElementById('l_username_id').value;
  let password = document.getElementById('l_password_id').value;

  if (localStorage.getItem(userName) === null) {
    alert('wrong password');
  } else if (localStorage.getItem(userName) === password) {
    alert('You are looged in, moving to game');
    $('#login-container-id').hide();
    $('#settings').show();
  }
};

const showDialogFunc = () => {
  stopMusicSound();
  document.getElementById('aboutDialog').showModal();
};

const closeDialogFunc = () => {
  document.getElementById('aboutDialog').close();
};

const settingsKey = (event, id) => {
  let keyChosen = event.key;
  $('#' + id).val(keyChosen);
  $('#' + id).prop('disabled', true);
  if (id === 'up') {
    upKeyCode = event.which;
  }
  if (id === 'down') {
    downKeyCode = event.which;
  }
  if (id === 'left') {
    leftKeyCode = event.which;
  }
  if (id === 'right') {
    rightKeyCode = event.which;
  }
};

function GetKeyPressed() {
  if (keysDown[upKeyCode]) {
    //Up
    return 1;
  }
  if (keysDown[downKeyCode]) {
    //Down
    return 2;
  }
  if (keysDown[leftKeyCode]) {
    //Left
    return 3;
  }
  if (keysDown[rightKeyCode]) {
    //Right
    return 4;
  }
  return 0;
}

const resetSettingsKey = (id) => {
  $('#' + id).prop('disabled', false);
  $('#' + id).val('');
  $('#' + id).focus();
};

const updateFoodValue = (val) => {
  foodAmunt = val;
  document.getElementById('ballsAmount').value = val;
  document.getElementById('chosen_food_amount').value = val;

  // document.getElementById('foodAmunt').value = val;
  // foodAmunt = document.getElementById('foodAmunt').value;
};

const updateTimeValue = (val) => {
  chosen_game_time = val;
  document.getElementById('chosen_game_time').value = val;

  // document.getElementById('foodAmunt').value = val;
  // foodAmunt = document.getElementById('foodAmunt').value;
};

/* Random ettings*/
const randomSettings = () => {
  settingsKeyRandom('ArrowUp', 'up');
  settingsKeyRandom('ArrowDown', 'down');
  settingsKeyRandom('ArrowLeft', 'left');
  settingsKeyRandom('ArrowRight', 'right');
  upKeyCode = 38;
  downKeyCode = 40;
  leftKeyCode = 37;
  rightKeyCode = 39;
  settingRandomValue(randomIntFromInterval(50, 90), 'ballsAmount');
  settingRandomValue(randomIntFromInterval(60, 120), 'gameTime');
  settingRandomValue(randomIntFromInterval(1, 4), 'monstersAmount');
  document.getElementById('chosen_food_amount').value = document.getElementById(
    'ballsAmount'
  ).value;
  document.getElementById('chosen_game_time').value = document.getElementById(
    'gameTime'
  ).value;
  //for ball colors
  let colorsToPick = [
    '#A52A2A',
    '#7FFF00',
    '#6495ED',
    '#B0E0E6',
    '#FFD700',
    '#2F4F4F',
    '#FF00FF',
    '#CD853F',
  ];
  let randomIndex = randomIntFromInterval(0, 7);
  settingRandomValue(colorsToPick[randomIndex], 'smallBallColor');
  colorsToPick.splice(randomIndex, 1);
  randomIndex = randomIntFromInterval(0, 6);
  settingRandomValue(colorsToPick[randomIndex], 'mediumBallColor');
  colorsToPick.splice(randomIndex, 1);
  randomIndex = randomIntFromInterval(0, 5);
  settingRandomValue(colorsToPick[randomIndex], 'bigBallColor');
};

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const settingsKeyRandom = (keyChosen, id) => {
  $('#' + id).val(keyChosen);
  $('#' + id).prop('disabled', true);
};

const settingRandomValue = (value, id) => {
  $('#' + id).val(value);
};

const initGame = () => {
  $('#settings').hide();
  context = canvas.getContext('2d');
  $('#GameBox').show();
  Start();
};

//////GAME////////

const cellType = {
  Empty: '0',
  Food_5: '1',
  Food_15: '14',
  Food_25: '15',
  Food_50: '16',
  Heart: '5',
  HourGlass: '6',
  Wall: '7',
  Ghost_1: '8',
  Ghost_2: '18',
  Ghost_3: '10',
  Ghost_4: '17',
  Pacman: '11',
  Heart: '12',
};

const keyType = {
  Up: '0',
  Down: '1',
  Left: '2',
  Right: '3',
};

//val for game
let upKeyCode;
let downKeyCode;
let leftKeyCode;
let rightKeyCode;

//BallsInit
var firstBallColor = new ball(60, 'blue', 5, 3); //last param is size in pixels
var secondBallColor = new ball(30, 'green', 15, 5);
var thirdBallColor = new ball(10, 'red', 25, 8);

//Ghosts
let ghosts;
let ghotsAmount;
let s_Matrix;
let g_board;

size_of_board = 20;

const Start = () => {
  cell_height = canvas.height / size_of_board;
  cell_width = canvas.width / size_of_board;
  board = new Array();
  score = 0;
  pac_color = 'yellow';
  //init pacman
  pacman = new Object();
  pacman.lives = 5;
  NumberOfdLives = 5;

  var cnt = 200;
  var f_total = 50;
  var pacman_remain = 1;
  start_time = new Date();
  pause_time = new Date();
  tempTime = 0;
  let now = new Date();
  tempTime = tempTime + (now - pause_time) / 1000;
  // console.log('tempTime', tempTime)

  for (var i = 0; i < size_of_board; i++) {
    board[i] = new Array();
    //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)

    for (var j = 0; j < size_of_board; j++) {
      if (isWall(i, j)) {
        board[i][j] = 4;
      } else {
        var randomNum = Math.random();
        if (randomNum <= (1.0 * f_total) / cnt) {
          f_total--;
          board[i][j] = 0;
        } else if (
          randomNum < (1.0 * (pacman_remain + f_total)) / cnt &&
          i != 0 &&
          i != size_of_board - 1 &&
          j != 0 &&
          j != size_of_board - 1
        ) {
          shape.i = i;
          shape.j = j;
          pacman_remain--;
          board[i][j] = 2;
        } else {
          board[i][j] = 0;
        }
        cnt--;
      }
    }
  }

  for (let i = 0; i < size_of_board; i++) {
    for (let j = 0; j < size_of_board; j++) {
      if (
        i == 0 ||
        i == size_of_board - 1 ||
        j == 0 ||
        j == size_of_board - 1
      ) {
        board[i][j] = 4; //wall
      }
    }
  }
  // while (f_total > 0) {
  //   var emptyCell = getEmptyCell(board);
  //   board[emptyCell[0]][emptyCell[1]] = 1;
  //   f_total--;
  // }

  //GHOST-HANDLER

  s_Matrix = [
    [-1, 1, 0, 0], //row
    [0, 0, -1, 1], //col
  ];

  g_board = new Array();

  for (let i = 0; i < size_of_board; i++) {
    g_board[i] = new Array();
  }

  for (let i = 0; i < size_of_board; i++) {
    for (let j = 0; j < size_of_board; j++) {
      g_board[i][j] = cellType.Empty;
    }
  }

  setSetting();
  InitialzeAllGhosts();
  foodSet();
  setSpecialFood();
  setSpecial();
  musicSound();

  keysDown = {};
  addEventListener(
    'keydown',
    function (e) {
      keysDown[e.keyCode] = true;
    },
    false
  );
  addEventListener(
    'keyup',
    function (e) {
      keysDown[e.keyCode] = false;
    },
    false
  );
  interval = setInterval(UpdatePosition, 250);
  ghosts_interval = setInterval(gPositionUpdater, 350);
  special_food_interval = setInterval(SetSpecialFood, 200);
  special_heart_interval = setInterval(updateS, 800);
};

const isWall = (i, j) => {
  if (
    (i == 2 && j == 2) ||
    (i == 2 && j == 3) ||
    (i == 2 && j == 4) ||
    (i == 2 && j == 5) ||
    (i == 2 && j == 6) ||
    (i == 2 && j == 8) ||
    (i == 2 && j == 9) ||
    (i == 2 && j == 10) ||
    (i == 2 && j == 11) ||
    (i == 2 && j == 13) ||
    (i == 2 && j == 14) ||
    (i == 2 && j == 15) ||
    (i == 2 && j == 17) ||
    (i == 4 && j == 2) ||
    (i == 4 && j == 3) ||
    (i == 4 && j == 4) ||
    (i == 4 && j == 5) ||
    (i == 4 && j == 6) ||
    (i == 4 && j == 8) ||
    (i == 4 && j == 9) ||
    (i == 4 && j == 10) ||
    (i == 4 && j == 11) ||
    (i == 4 && j == 13) ||
    (i == 4 && j == 14) ||
    (i == 4 && j == 15) ||
    (i == 4 && j == 17) ||
    (i == 6 && j == 2) ||
    (i == 6 && j == 3) ||
    (i == 6 && j == 5) ||
    (i == 7 && j == 5) ||
    (i == 8 && j == 5) ||
    (i == 9 && j == 5) ||
    (i == 10 && j == 5) ||
    (i == 11 && j == 5) ||
    (i == 8 && j == 6) ||
    (i == 8 && j == 7) ||
    (i == 6 && j == 7) ||
    (i == 6 && j == 8) ||
    (i == 6 && j == 9) ||
    (i == 6 && j == 10) ||
    (i == 6 && j == 11) ||
    (i == 7 && j == 9) ||
    (i == 8 && j == 9) ||
    (i == 6 && j == 7) ||
    (i == 6 && j == 8) ||
    (i == 6 && j == 9) ||
    (i == 6 && j == 10) ||
    (i == 6 && j == 11) ||
    (i == 7 && j == 9) ||
    (i == 8 && j == 9) ||
    (i == 11 && j == 5) ||
    (i == 8 && j == 6) ||
    (i == 8 && j == 7) ||
    (i == 6 && j == 13) ||
    (i == 7 && j == 13) ||
    (i == 8 && j == 13) ||
    (i == 9 && j == 13) ||
    (i == 10 && j == 13) ||
    (i == 11 && j == 13) ||
    (i == 8 && j == 12) ||
    (i == 8 && j == 11) ||
    (i == 8 && j == 6) ||
    (i == 8 && j == 7) ||
    (i == 17 && j == 13) ||
    (i == 16 && j == 13) ||
    (i == 15 && j == 13) ||
    (i == 14 && j == 13) ||
    (i == 13 && j == 13) ||
    // (i == 12 && j == 13) ||
    (i == 17 && j == 12) ||
    (i == 17 && j == 11) ||
    (i == 17 && j == 6) ||
    (i == 17 && j == 7) ||
    (i == 17 && j == 8) ||
    (i == 17 && j == 9) ||
    (i == 17 && j == 5) ||
    (i == 17 && j == 3) ||
    (i == 17 && j == 2) ||
    (i == 17 && j == 15) ||
    (i == 17 && j == 16) ||
    (i == 17 && j == 18) ||
    (i == 15 && j == 11) ||
    (i == 15 && j == 13) ||
    (i == 15 && j == 11) ||
    (i == 15 && j == 10) ||
    (i == 15 && j == 9) ||
    (i == 15 && j == 8) ||
    (i == 15 && j == 7) ||
    (i == 15 && j == 5) ||
    (i == 15 && j == 4) ||
    (i == 15 && j == 3) ||
    (i == 15 && j == 2) ||
    (i == 15 && j == 16) ||
    (i == 15 && j == 15) ||
    (i == 15 && j == 17) ||
    (i == 14 && j == 16) ||
    (i == 14 && j == 15) ||
    (i == 12 && j == 15) ||
    (i == 12 && j == 16) ||
    (i == 12 && j == 11) ||
    (i == 12 && j == 10) ||
    (i == 12 && j == 9) ||
    (i == 12 && j == 8) ||
    (i == 12 && j == 7) ||
    (i == 12 && j == 3) ||
    (i == 13 && j == 9) ||
    (i == 13 && j == 5) ||
    (i == 10 && j == 17) ||
    (i == 10 && j == 16) ||
    (i == 10 && j == 15) ||
    (i == 9 && j == 15) ||
    (i == 8 && j == 15) ||
    (i == 7 && j == 15) ||
    (i == 6 && j == 18) ||
    (i == 7 && j == 2) ||
    (i == 8 && j == 2) ||
    (i == 9 && j == 2) ||
    (i == 10 && j == 2) ||
    (i == 11 && j == 2) ||
    (i == 12 && j == 2) ||
    (i == 7 && j == 3) ||
    (i == 16 && j == 7) ||
    (i == 14 && j == 17) ||
    (i == 14 && j == 17) ||
    (i == 15 && j == 2) ||
    (i == 15 && j == 2) ||
    (i == 14 && j == 13) ||
    (i == 13 && j == 13)

    // (i == 6 && j == 1) ||
    // (i == 6 && j == 2)
  ) {
    return true;
  }
};

const getEmptyCell = (board) => {
  var i = Math.floor(Math.random() * 9 + 1);
  var j = Math.floor(Math.random() * 9 + 1);
  while (board[i][j] != 0) {
    i = Math.floor(Math.random() * 9 + 1);
    j = Math.floor(Math.random() * 9 + 1);
  }
  return [i, j];
};

const keyGetter = () => {
  if (keysDown[38]) {
    return 1;
  }
  if (keysDown[40]) {
    return 2;
  }
  if (keysDown[37]) {
    return 3;
  }
  if (keysDown[39]) {
    return 4;
  }
  return 0;
};

const musicSound = () => {
  document.getElementById('song_id').play();
  document.getElementById('song_id').volume = 0.05;
};

const stopMusicSound = () =>{
  document.getElementById('song_id').pause();
}

const setSetting = () => {
  // ballAmount = $("#ballsAmount").val();
  // ballAmount = 60;
  // ballAmount = $("#ballsAmount").val();
  // firstBallColor.color;
  // var timeForGame = 60;
  // NumberOfMonsters=4;

  ballAmount = $('#ballsAmount').val();
  if (!(ballAmount >= 50 && ballAmount <= 90)) {
    settingRandomValue(randomIntFromInterval(50, 90), 'ballsAmount');
    ballAmount = $('#ballsAmount').val();
  }
  ghotsAmount = $('#monstersAmount').val();
  if (!(ghotsAmount >= 1 && ghotsAmount <= 4)) {
    settingRandomValue(randomIntFromInterval(1, 4), 'monstersAmount');
    ghotsAmount = $('#monstersAmount').val();
  }
  timeForGame = $('#gameTime').val();
  if (!(timeForGame >= 60)) {
    settingRandomValue(randomIntFromInterval(60, 120), 'gameTime');
    timeForGame = $('#gameTime').val();
  }
  firstBallColor.color = $('#smallBallColor').val();
  if (firstBallColor.color === '' || isColor(firstBallColor.color) == false) {
    firstBallColor.color = 'DarkMagenta';
  }
  secondBallColor.color = $('#mediumBallColor').val();
  if (secondBallColor.color === '' || isColor(secondBallColor.color) == false) {
    secondBallColor.color = 'GreenYellow';
  }
  thirdBallColor.color = $('#bigBallColor').val();
  if (thirdBallColor.color === '' || isColor(thirdBallColor.color) == false) {
    thirdBallColor.color = 'Peru';
  }

  $('#sett1').text('Up Key: ' + $('#up').val());
  $('#sett2').text('Down Key: ' + $('#down').val());
  $('#sett3').text('Left Key: ' + $('#left').val());
  $('#sett4').text('Right Key: ' + $('#right').val());
  $('#sett5').text('Balls amount: ' + ballAmount);
  $('#sett6').text('5-Points ball color: ' + firstBallColor.color);
  $('#sett6').css('color', firstBallColor.color);
  $('#sett7').text('15-Points ball color: ' + secondBallColor.color);
  $('#sett7').css('color', secondBallColor.color);
  $('#sett8').text('25-Points ball color: ' + thirdBallColor.color);
  $('#sett8').css('color', thirdBallColor.color);
  $('#sett9').text('Game time: ' + timeForGame + ' seconds');
  $('#sett10').text('Monsters amount: ' + ghotsAmount);
};

function isColor(strColor) {
  //helper function
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}

const InitialzeAllGhosts = () => {
  // ghotsAmount = 4;
  ghosts = new Array(ghotsAmount);

  for (let i = 0; i < ghotsAmount; i++) {
    ghosts[i] = new Object();

    if (i == 0) {
      ghosts[i].ghost_number = cellType.Ghost_1;
      ghosts[i].ghost_color = 'blue';

      ghosts[i].image_right = new Image(cell_width, cell_height);
      ghosts[i].image_right.src = './images/ghost-blue-right.png';

      ghosts[i].image_left = new Image(cell_width, cell_height);
      ghosts[i].image_left.src = './images/ghost-blue-left.png';

      ghosts[i].row = 1;
      ghosts[i].col = 1;

      ghosts[i].previos_step = takeStepAtRandom(i);

      g_board[1][1] = cellType.Ghost_1;
    } else if (i == 1) {
      ghosts[i].ghost_number = cellType.Ghost_2;
      ghosts[i].ghost_color = 'red';

      ghosts[i].image_right = new Image(cell_width, cell_height);
      ghosts[i].image_right.src = './images/ghost-red-right.png';

      ghosts[i].image_left = new Image(cell_width, cell_height);
      ghosts[i].image_left.src = './images/ghost-red-left.png';

      ghosts[i].row = 1;
      ghosts[i].col = size_of_board - 2;

      ghosts[i].previos_step = takeStepAtRandom(i);

      g_board[1][size_of_board - 2] = cellType.Ghost_2;
    } else if (i == 2) {
      ghosts[i].ghost_number = cellType.Ghost_3;
      ghosts[i].ghost_color = 'green';

      ghosts[i].image_right = new Image(cell_width, cell_height);
      ghosts[i].image_right.src = './images/ghost-green-right.png';

      ghosts[i].image_left = new Image(cell_width, cell_height);
      ghosts[i].image_left.src = './images/ghost-green-left.png';

      ghosts[i].row = size_of_board - 2;
      ghosts[i].col = 1;
      ghosts[i].previos_step = takeStepAtRandom(i);

      g_board[size_of_board - 2][1] = cellType.Ghost_3;
    } else if (i == 3) {
      ghosts[i].ghost_number = cellType.Ghost_4;
      ghosts[i].ghost_color = 'yellow';

      ghosts[i].image_right = new Image(cell_width, cell_height);
      ghosts[i].image_right.src = './images/ghost-yellow-right.png';

      ghosts[i].image_left = new Image(cell_width, cell_height);
      ghosts[i].image_left.src = './images/ghost-yellow-left.png';

      ghosts[i].row = size_of_board - 2;
      ghosts[i].col = size_of_board - 2;
      ghosts[i].previos_step = takeStepAtRandom(i);

      g_board[size_of_board - 2][size_of_board - 2] = cellType.Ghost_4;
    }

    ghosts[i].draw = ghosts[i].image_left; //set default loaction to each ghost.
  }
};

const takeStepAtRandom = (i) => {
  let rand_generated_number;

  while (true) {
    rand_generated_number = Math.random();

    if (
      rand_generated_number < 0.25 &&
      board[ghosts[i].row + 1][ghosts[i].col] != cellType.Wall
    ) {
      return keyType.Down;
    } else if (
      rand_generated_number >= 0.25 &&
      rand_generated_number < 0.5 &&
      board[ghosts[i].row - 1][ghosts[i].col] != cellType.Wall
    ) {
      return keyType.Up;
    } else if (
      rand_generated_number >= 0.5 &&
      rand_generated_number < 0.75 &&
      board[ghosts[i].row][ghosts[i].col + 1] != cellType.Wall
    ) {
      return keyType.Right;
    } else if (
      rand_generated_number >= 0.75 &&
      board[ghosts[i].row][ghosts[i].col - 1] != cellType.Wall
    ) {
      return keyType.Left;
    }
  }
};

var packmanSideTemp = 3;

const Draw = (packmanSide) => {
  canvas.width = canvas.width;
  // flag = true;

  if (packmanSide < 1 || packmanSide > 4) {
    packmanSide = packmanSideTemp;
  } else {
    packmanSideTemp = packmanSide;
  }
  // lblScore.value = '10';

  lblScore.value = score;
  lblTime.value = time_elapsed;
  lblLives.value = NumberOfdLives;

  for (var i = 0; i < size_of_board; i++) {
    for (var j = 0; j < size_of_board; j++) {
      var center = new Object();

      center.y = (i + 1 / 2) * cell_height;
      center.x = (j + 1 / 2) * cell_width;
      // center.x = i * 60 + 30;
      // center.y = j * 60 + 30;
      let min_radius = Math.min(cell_height, cell_width);

      if (board[i][j] == 2) {
        packmanDraw(packmanSide, center);

        //FOOD
      } else if (board[i][j] == 1) {
        context.beginPath();
        context.arc(center.x, center.y, min_radius / 7, 0, 2 * Math.PI); // circle

        // circle
        // context.fillStyle = 'yellow'; //color
        context.fillStyle = firstBallColor.color; //color

        context.fill();
      } else if (board[i][j] == 14) {
        context.beginPath();
        context.arc(center.x, center.y, min_radius / 5, 0, 2 * Math.PI); // circle

        // circle
        // context.fillStyle = 'magenta';
        context.fillStyle = secondBallColor.color; //color
        context.fill();
      } else if (board[i][j] == 15) {
        context.beginPath();
        context.arc(center.x, center.y, min_radius / 3, 0, 2 * Math.PI); // circle

        // circle
        // context.fillStyle = '#ff0000';
        context.fillStyle = thirdBallColor.color; //color
        context.fill();
      }
      //WALL
      else if (board[i][j] == 4) {
        context.beginPath();
        context.rect(
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );

        context.fillStyle = '#191970'; //color
        context.fill();
        //CELL
      } else if (board[i][j] == 0) {
        context.beginPath();

        context.fillStyle = 'black';
        context.fillRect(
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );
      } else if (board[i][j] == cellType.Food_50 && d.appear) {
        context.drawImage(
          d.image,
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );
      } else if (board[i][j] == cellType.Heart && s.appearnce) {
        context.drawImage(
          s.image,
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );
      }
    }
  }

  //draw ghosts
  for (let i = 0; i < size_of_board; i++) {
    for (let j = 0; j < size_of_board; j++) {
      let center = new Object();

      center.y = (i + 1 / 2) * cell_height;
      center.x = (j + 1 / 2) * cell_width;
      if (g_board[i][j] == cellType.Ghost_1) {
        context.drawImage(
          ghosts[0].draw,
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );
      } else if (g_board[i][j] == cellType.Ghost_2) {
        // flag = false;
        context.drawImage(
          ghosts[1].draw,
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );
      } else if (g_board[i][j] == cellType.Ghost_3) {
        context.drawImage(
          ghosts[2].draw,
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );
      } else if (g_board[i][j] == cellType.Ghost_4) {
        context.drawImage(
          ghosts[3].draw,
          center.x - cell_width / 2,
          center.y - cell_height / 2,
          cell_height,
          cell_height
        );
      }
    }
  }
};

var PackmanstartAngle = 1.15;
var PackmanEndAngle = 0.85;
var PackmanEye = new Object();
PackmanEye.x = 4; //was 5
PackmanEye.y = -12; // was -15
const packmanDraw = (side, center) => {
  if (side == 2) {
    PackmanstartAngle = 0.65;
    PackmanEndAngle = 0.35;
    PackmanEye.x = 12;
    PackmanEye.y = 4;
  } else if (side == 1) {
    PackmanstartAngle = 1.65;
    PackmanEndAngle = 1.35;
    PackmanEye.x = 12;
    PackmanEye.y = -4;
  } else if (side == 4) {
    PackmanstartAngle = 0.15;
    PackmanEndAngle = 1.85;
    PackmanEye.x = 4;
    PackmanEye.y = -12;
  } else if (side == 3) {
    PackmanstartAngle = 1.15;
    PackmanEndAngle = 0.85;
    PackmanEye.x = -4; //was -5
    PackmanEye.y = -12; // was 15
  }
  context.beginPath();
  context.arc(
    center.x,
    center.y,
    15,
    PackmanstartAngle * Math.PI,
    PackmanEndAngle * Math.PI
  ); // half circle
  context.lineTo(center.x, center.y);
  context.fillStyle = pac_color; //color
  context.fill();
  context.beginPath();
  context.arc(
    center.x + PackmanEye.x,
    center.y + PackmanEye.y,
    2,
    0,
    2 * Math.PI
  ); // circle
  context.fillStyle = 'black'; //color
  context.fill();
};

const UpdatePosition = () => {
  board[shape.i][shape.j] = 0;
  // var x = keyGetter();
  var x = GetKeyPressed();
  if (x == 1) {
    //Up
    // if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
    //   shape.j--;
    // }
    if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
      shape.i--;
    }
  }

  if (x == 2) {
    //Down
    // if (shape.j < size_of_board && board[shape.i][shape.j + 1] != 4) {
    //   shape.j++;
    // }
    if (shape.i < size_of_board && board[shape.i + 1][shape.j] != 4) {
      shape.i++;
    }
  }
  if (x == 3) {
    //Left
    // if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
    //   shape.i--;
    // }
    if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
      shape.j--;
    }
  }
  if (x == 4) {
    //Right
    // if (shape.i < size_of_board && board[shape.i + 1][shape.j] != 4) {
    //   shape.i++;
    if (shape.j < size_of_board && board[shape.i][shape.j + 1] != 4) {
      shape.j++;
    }
  }
  if (board[shape.i][shape.j] == 1) {
    score += 5;
    totalFood++;
  }
  if (board[shape.i][shape.j] == cellType.Food_15) {
    score += 15;
    totalFood++;
  }
  if (board[shape.i][shape.j] == cellType.Food_25) {
    score += 25;
    totalFood++;
  }

  if (board[shape.i][shape.j] == cellType.Food_50 && d.appear) {
    d.appear = false;
    score += 50;
  }
  if (board[shape.i][shape.j] == cellType.Heart && s.appearnce) {
    NumberOfdLives++;
    s.times--;
  }

  board[shape.i][shape.j] = 2;
  var currentTime = new Date();
  time_elapsed = (currentTime - start_time) / 1000;
  // Draw(x);

  //Game time finish
  if (time_elapsed >= timeForGame) {
    window.clearInterval(interval);
    window.clearInterval(ghosts_interval);
    window.clearInterval(special_food_interval);
    window.clearInterval(special_heart_interval);

    if (score < 100) {
      window.alert('You are better than ' + score + ' points!');
    } else {
      window.alert('Winner!!!');
    }
    restartGame();
  }

  Draw(x);
};

const gPositionUpdater = () => {
  g_board[2][size_of_board - 2] = '0';

  let rand_generated_number;

  let numOfGhosts;

  for (let i = 0; i < ghotsAmount; i++) {
    // numOfGhosts = 10;
    numOfGhosts = true;

    rand_generated_number = Math.random();

    if (
      rand_generated_number < 0.3 &&
      ghostMoveValidator(i, ghosts[i].previos_step)
    ) {
      gStepUpdate(i, ghosts[i].previos_step);
    } else {
      while (numOfGhosts > 0) {
        rand_generated_number = Object.keys(keyType).length * Math.random();
        let generated_m = Math.floor(rand_generated_number);

        if (rangeValidator(i, generated_m)) {
          gStepUpdate(i, generated_m);

          break;
        }

        // numOfGhosts--;
        numOfGhosts == false;
      }
    }
  }
  // Draw()
  checkIfAlive();
};

const value_limit = (val, min, max) => {
  return val < min ? min : val > max ? max : val;
};

const ghostMoveValidator = (i, step) => {
  if (
    board[ghosts[i].row + s_Matrix[0][step]][
      ghosts[i].col + s_Matrix[1][step]
    ] == '4' ||
    g_board[ghosts[i].row + s_Matrix[0][step]][
      ghosts[i].col + s_Matrix[1][step]
    ] != '0'
  ) {
    return false;
  }

  return true;
};

const rangeValidator = (i, step) => {
  if (!ghostMoveValidator(i, step)) {
    return false;
  }

  rand_generated_number = Math.random();

  if (rand_generated_number > 0.95) {
    return true;
  }

  let r_dist = ghosts[i].row - shape.i;
  let c_dist = ghosts[i].col - shape.j;

  let o_dist = Math.abs(c_dist) + Math.abs(r_dist);

  r_dist = ghosts[i].row + s_Matrix[0][step] - shape.i;
  c_dist = ghosts[i].col + s_Matrix[1][step] - shape.j;

  let new_d = Math.abs(c_dist) + Math.abs(r_dist);

  if (o_dist > new_d) {
    return true;
  }

  return false;
};

const gStepUpdate = (i, step) => {
  // g_board[ghosts[i].row][ghosts[i].col] = cellType.Empty;

  g_board[ghosts[i].row][ghosts[i].col] = cellType.Empty;

  ghosts[i].row += s_Matrix[0][step];
  ghosts[i].col += s_Matrix[1][step];

  if (step == keyType.Right) {
    ghosts[i].draw = ghosts[i].image_right;
  } else if (step == keyType.Left) {
    ghosts[i].draw = ghosts[i].image_left;
  }

  g_board[ghosts[i].row][ghosts[i].col] = ghosts[i].ghost_number;
  g_board[i].previos_step = step;
};

const checkIfAlive = () => {
  if (checkCatch()) {
    if (score - 10 > 0) {
      score -= 10;
    }
    // pause_time = new Date();

    if (NumberOfdLives == 0) {
      window.clearInterval(interval);
      window.clearInterval(ghosts_interval);

      window.alert('Loser!');
      restartGame();
    } else {
      NumberOfdLives--;
      pause_time = new Date();
      ghostPUpdate();
      window.alert(
        'Ghosts catch pacman. only ' + NumberOfdLives + ' live remain'
      );
      board[shape.i][shape.j] = cellType.Empty;
      keysDown = {};
      placePacman();
    }
  } else {
    Draw();
  }
};

const placePacman = () => {
  let loaction = randomCellGenerator();

  shape.i = loaction.row;
  pacman.j = loaction.col;

  board[shape.i][shape.j] = cellType.Pacman;
};

const randomCellGenerator = () => {
  let loaction = new Object();

  let i = Math.floor(Math.random() * (size_of_board / 2) + 5);
  let j = Math.floor(Math.random() * (size_of_board / 2) + 5);

  while (board[i][j] != '0') {
    i = Math.floor(Math.random() * (size_of_board / 2) + 5);
    j = Math.floor(Math.random() * (size_of_board / 2) + 5);
  }

  loaction.row = i;
  loaction.col = j;

  return loaction;
};

const checkCatch = () => {
  let row;
  let col;

  for (let i = 0; i < ghotsAmount; i++) {
    row = ghosts[i].row;
    col = ghosts[i].col;

    if (row == shape.i && col == shape.j) {
      return true;
    }
  }

  return false;
};

const ghostPUpdate = () => {
  //remove  ghost from her current location.

  for (let i = 0; i < size_of_board; i++) {
    for (let j = 0; j < size_of_board; j++) {
      g_board[i][j] = cellType.Empty;
    }
  }

  for (let numOfGhosts = 0; numOfGhosts < ghotsAmount; numOfGhosts++) {
    //blue ghost
    if (numOfGhosts == 0) {
      ghosts[0].row = 1;
      ghosts[0].col = 1;
      g_board[1][1] = cellType.Ghost_1;
    } else if (numOfGhosts == 1) {
      //red ghost
      ghosts[1].row = 1;
      ghosts[1].col = size_of_board - 2;
      g_board[2][size_of_board - 2] = cellType.Ghost_2;
    } else if (numOfGhosts == 2) {
      //green ghost
      ghosts[2].row = size_of_board - 2;
      ghosts[2].col = 1;
      g_board[size_of_board - 2][1] = cellType.Ghost_3;
    } else if (numOfGhosts == 3) {
      //yellow ghost
      ghosts[3].row = size_of_board - 2;
      ghosts[3].col = size_of_board - 2;
      g_board[size_of_board - 2][size_of_board - 2] = cellType.Ghost_4;
    }
  }
};

const foodSet = () => {
  foodAmount = 60; // TOCHANGE
  let rand_generated_number;
  let free_places_amount = (size_of_board - 2) * (size_of_board - 2) - 48 * 4;

  let type_of_5 = Math.floor(0.6 * foodAmount);
  let type_of_15 = Math.floor(0.3 * foodAmount);
  let type_of_25 = Math.floor(0.1 * foodAmount);

  let f_total = type_of_5 + type_of_15 + type_of_25;

  while (f_total > 0) {
    for (let i = 1; i < size_of_board - 1; i++) {
      for (let j = 1; j < size_of_board - 1; j++) {
        if (f_total > 0 && board[i][j] == '0') {
          rand_generated_number = Math.random();

          if (
            rand_generated_number <
            foodAmount /
              ((size_of_board - 2) * (size_of_board - 2) - free_places_amount)
          ) {
            rand_generated_number = Math.random();

            if (rand_generated_number < 0.6 && type_of_5 > 0) {
              board[i][j] = cellType.Food_5;
              type_of_5--;
            } else if (
              rand_generated_number >= 0.6 &&
              rand_generated_number < 0.9 &&
              type_of_15 > 0
            ) {
              board[i][j] = cellType.Food_15;
              type_of_15--;
            } else if (type_of_25 > 0) {
              board[i][j] = cellType.Food_25;
              type_of_25--;
            }
          }

          f_total = type_of_5 + type_of_15 + type_of_25;
        }
      }
    }
  }

  // set();
};

const setSpecialFood = () => {
  d = new Object();

  d.appear = true;
  d.previos_step = keyType.Left;

  d.image = new Image(cell_width, cell_height);
  d.image.src = './images/cherry_image_2.png';

  //choose rand_generated_number step
  rand_generated_number = Object.keys(keyType).length * Math.random();
  d.previous_step = Math.floor(rand_generated_number);

  d.previous_cell = cellType.Empty;

  //initial loaction
  if (ghotsAmount == 4) {
    let loaction = new Object();
    loaction = randomCellGenerator();
    d.row = loaction.row;
    d.col = loaction.col;
  } else {
    d.row = size_of_board - 2;
    d.col = size_of_board - 2;
  }
  board[d.row][d.col] = cellType.Food_50;
};

const setSpecial = () => {
  //s
  s = new Object();
  s.times = 2;
  s.image = new Image(cell_width, cell_height);
  s.image.src = './images/Pacman_live.svg.png';
  s.appearnce = false;

  setS();
};

const setS = () => {
  let loaction = randomCellGenerator();

  if (s.appearnce) {
    board[s.row][s.col] = cellType.Empty;
  }

  s.row = loaction.row;
  s.col = loaction.col;

  board[s.row][s.col] = cellType.Heart;
};

const SetSpecialFood = () => {
  if (d.appear) {
    rand_generated_number = Object.keys(keyType).length * Math.random();

    if (
      rand_generated_number < 0.9 &&
      board[d.row + s_Matrix[0][d.previos_step]][
        d.col + s_Matrix[1][d.previos_step]
      ] != '4'
    ) {
      updateD(d.previos_step);
    } else {
      let num_of_movments = 5;

      while (num_of_movments > 0) {
        rand_generated_number = Object.keys(keyType).length * Math.random();
        let generated_m = Math.floor(rand_generated_number);

        if (
          board[d.row + s_Matrix[0][generated_m]][
            d.col + s_Matrix[1][generated_m]
          ] != '4'
        ) {
          updateD(generated_m);

          break;
        }

        num_of_movments--;
      }
    }

    board[d.row][d.col] = cellType.Food_50;
  }
};

const updateS = () => {
  if (s.appearnce || s.times == 0) {
    s.appearnce = false;
  } else {
    s.appearnce = true;
    setS();
  }
};

const updateD = (generated_m) => {
  board[d.row][d.col] = d.previous_cell;

  d.row += s_Matrix[0][generated_m];
  d.col += s_Matrix[1][generated_m];

  if (board[d.row][d.col] == '2') {
    d.appear = false;
    score += 50;

    return;
  }

  d.previos_step = generated_m;
  d.previous_cell = board[d.row][d.col];
  board[d.row][d.col] = cellType.Food_50;
};

const restartGame = () => {
  window.clearInterval(interval);
  window.clearInterval(ghosts_interval);
  window.clearInterval(special_food_interval);
  window.clearInterval(special_heart_interval);
  //alert('Starting new game!');
  //Start();
  stopMusicSound();
  $('#GameBox').hide();
  $('#settings').show();
};

const stopGame = () => {
  window.clearInterval(interval);
  window.clearInterval(ghosts_interval);
  window.clearInterval(special_food_interval);
  window.clearInterval(special_heart_interval);

};
