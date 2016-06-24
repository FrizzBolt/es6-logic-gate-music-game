//Initialize Audio Context
window.AudioContext = window.AudioContext || window.webkitAudioContext;

//Dimensions of Grid in Pixels
const GRID_X_LENGTH_PX = 1000;
const GRID_Y_LENGTH_PX = 1000;

//Dimensions of Grid in Cells
const GRID_X_LENGTH_CELL = 10;
const GRID_Y_LENGTH_CELL = 10;

//Dimensions of Cell in Pixels
const CELL_X_LENGTH_PX = GRID_X_LENGTH_PX / GRID_X_LENGTH_CELL;
const CELL_Y_LENGTH_PX = GRID_Y_LENGTH_PX / GRID_Y_LENGTH_CELL;

const BEATS_PER_MINUTE = 100


class Component {
  constructor() {
    this.gridXPos = nil;
    this.gridYPos = nil;
  }

  get GridXPos() {
    return this.gridXPos;
  }

  set GridXPos(value) {
    this.gridXPos = value;
  }

  get GridYPos() {
    return this.gridYPos;
  }

  set GridYPos(value) {
    this.gridYPos = value;
  }

  get PixelXPos() {
    if (this.gridXPos) {
      this.gridXPos * CELL_X_LENGTH_PX;
    } else {
      throw "Object:" + this + " - Cannot return X position in pixels without setting grid position";
    }
  }

  get PixelYPos() {
    if (this.gridYPos) {
      this.gridXPos * CELL_X_LENGTH_PX;
    } else {
      throw "Object:" + this + " - Cannot return Y position in pixels without setting grid position";
    }
  }
}

class Clock extends Component {
  //NOTE: The term "Duration" is used to represent the duration in beats before
  //      the clock switches the state of the current.
  //      (EX: A clock with a duration of 2 will switch states every 2 beats)
  constructor(gridXPos, gridYPos, outputNode, duration) {
  super(gridXPos, gridYPos);
  this.outputNode = outputNode;
  this.duration = duration;
  }
}

class LogicGate extends Component {
  constructor(gridXpos, gridYpos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos);
    this.inputNodeA = inputNodeA;
    this.inputNodeB = inputNodeB;
    this.outputNode = outputNode;
  }
}

class ANDGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }

  isActive() {
    return (this.inputNodeA.isActive() && this.inputNodeB.isActive())
  }
}


class ORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }


  isActive() {
    return (this.inputNodeA.isActive() || this.inputNodeB.isActive())
  }
}

class XORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }


  isActive() {
    if (inputNodeA.isActive() && inputNodeB.isActive()) {
      return false;
    } else if (inputNodeA.isActive() || inputNodeB.isActive()) {
      return true;
    } else {
      return false;
    }
  }
}


class NANDGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }


  isActive() {
    if (inputNodeA.isActive() && inputNodeB.isActive()) {
      return false;
    } else {
      return true;
    }
  }
}


class NORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }

  isActive() {
    return (!(inputNodeA.isActive() || inputNodeB.isActive()))
  }
}


class XNORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }

  isActive() {
    if (inputNodeA.isActive() && inputNodeB.isActive()) {
      return false;
    } else if (inputNodeA.isActive() || inputNodeB.isActive()) {
      return true;
    } else {
      return false;
    }
  }
}


class Tone {
    constructor(gridYPos) {
        this.gridYPos = gridYPos;
    }

    get GridYPos() {
      return this.gridYPos;
    }

    frequency() {
        return 440 * Math.pow(2, (this.Num / 12));
    }
}


class Player {

    //NOTE: A maximum of 6 Audio Contexts can be active at one time. Playing
    //      more than one tone per audio context results in overlapping waveforms.
    //      This means that only 6 notes will be able to play at any given time
    //      and the program should run a check to confirm that the user doesn't
    //      have more than 6 logic gates in one column of the grid. Also, the duration of
    //      the of the existence of each audio context should be slightly shorter than the
    //      BPM of the audio player to prevent overlap.

    static playTone(tone) {
        var ctx = new AudioContext();
        var t = ctx.currentTime;
        var osc = ctx.createOscillator();
        var duration = 200;
        osc.type = "sine"
        osc.frequency.value = tone.frequency();
        osc.start(t);
        osc.stop(t + duration);
        osc.connect(ctx.destination);
    }
}
